import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useRef } from "react";
import type { DrawingEntry } from "./types";

export function useLineDrawing() {
  const map = useMap();
  const lastLine = useRef<google.maps.Polyline | null>(null);
  const lineToCursor = useRef<google.maps.Polyline | null>(null);

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];

      // start a new line
      if (!lastEntry || lastEntry.type !== "line" || lastEntry.done) {
        const newEntry: DrawingEntry = {
          type: "line",
          points: [latLng],
          done: false,
        };
        return [...entries, newEntry];
      }

      // add the point
      return [
        ...entries.slice(0, -1),
        {
          ...entries[entries.length - 1],
          points: [...entries[entries.length - 1].points, latLng],
        },
      ];
    },
    [],
  );

  const startListeners = useCallback(
    (
      presentHistoryState: DrawingEntry[],
      addHistoryEntry: (entries: DrawingEntry[]) => void,
    ) => {
      if (!map) return;

      map.setOptions({ draggableCursor: "crosshair" });
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const newEntries = onClick(e.latLng, presentHistoryState);
        addHistoryEntry(newEntries);
      });

      map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
        lineToCursor.current?.setMap(null);
        const lastEntry = presentHistoryState[presentHistoryState.length - 1];

        if (!lastEntry || lastEntry.type !== "line") return;
        if (!lastLine.current) return;
        if (!e.latLng) return;

        const polyline = new google.maps.Polyline({
          path: [
            lastLine.current
              .getPath()
              .getAt(lastLine.current.getPath().getLength() - 1),
            e.latLng,
          ],
          strokeColor: "#0066FF",
          strokeOpacity: 0.4,
          strokeWeight: 2,
          editable: false,
          clickable: false,
          geodesic: true,
        });
        polyline.setMap(map);
        lineToCursor.current = polyline;
      });

      return () => {
        map.setOptions({ draggableCursor: "" });
        google.maps.event.clearListeners(map, "click");
        google.maps.event.clearListeners(map, "mousemove");
        lineToCursor.current?.setMap(null);
        lineToCursor.current = null;
      };
    },
    [map, onClick],
  );

  const draw = useCallback(
    (
      entry: DrawingEntry,
      onChange?: (entry: DrawingEntry) => void,
      isLastOfType = false,
    ) => {
      if (!map) return;

      const listeners: google.maps.MapsEventListener[] = [];

      const isDone = entry.done;

      if (isDone) {
        if (isLastOfType) {
          lastLine.current = null;
        }

        const polyline = new google.maps.Polyline({
          path: entry.points,
          strokeColor: "#0066FF",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          editable: true,
          geodesic: true,
        });
        polyline.setMap(map);
        function changePaths() {
          // remove undo icon
          const undo = document.querySelector(
            'img[src$="undo_poly.png"]',
          ) as HTMLImageElement;
          if (undo) undo.style.display = "none";

          onChange?.({
            ...entry,
            points: [
              ...polyline.getPath().getArray(),
              polyline.getPath().getAt(0),
            ],
          });
        }

        listeners.push(
          google.maps.event.addListener(
            polyline.getPath(),
            "insert_at",
            changePaths,
          ),
        );
        listeners.push(
          google.maps.event.addListener(
            polyline.getPath(),
            "set_at",
            changePaths,
          ),
        );
        return { shape: polyline, listeners };
      } else {
        const polyline = new google.maps.Polyline({
          path: entry.points,
          strokeColor: "#0066FF",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          editable: true,
          geodesic: true,
        });
        polyline.setMap(map);

        if (isLastOfType) {
          lastLine.current = polyline;
        }

        // check if first point is clicked
        // if so, close the polygon
        const clickListener = polyline.addListener(
          "click",
          (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;

            const firstPoint = polyline.getPath().getAt(0);
            const lastPoint = polyline
              .getPath()
              .getAt(polyline.getPath().getLength() - 1);

            // done
            if (firstPoint?.equals(e.latLng)) {
              // console.log('firstPoint clicked')
              onChange?.({
                ...entry,
                points: [...entry.points, firstPoint],
                done: true,
              });
            }

            // also done
            else if (lastPoint?.equals(e.latLng)) {
              // console.log('lastPoint clicked')
              onChange?.({
                ...entry,
                done: true,
              });
            }
          },
        );
        listeners.push(clickListener);

        // hover listener
        const hoverListener = polyline.addListener(
          "mouseover",
          (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            const firstPoint = polyline.getPath().getAt(0);
            const lastPoint = polyline
              .getPath()
              .getAt(polyline.getPath().getLength() - 1);

            if (firstPoint?.equals(e.latLng) && lineToCursor.current) {
              lineToCursor.current
                .getPath()
                .setAt(
                  lineToCursor.current.getPath().getLength() - 1,
                  firstPoint,
                );
            } else if (lastPoint?.equals(e.latLng)) {
              // console.log('hover lastPoint');
              if (lineToCursor.current) {
                lineToCursor.current?.setMap(null);
                lineToCursor.current = null;
              }
            }
          },
        );
        listeners.push(hoverListener);

        return { shape: polyline, listeners };
      }
    },
    [map],
  );

  return {
    draw,
    startListeners,
  };
}
