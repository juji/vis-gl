import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useRef } from "react";
import type { DrawingEntry } from "./types";

export function usePolygonDrawing() {
  const map = useMap();
  const lastLine = useRef<google.maps.Polyline | null>(null);
  const lineToCursor = useRef<google.maps.Polyline | null>(null);

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];

      // start a new polygon
      if (!lastEntry || lastEntry.type !== "polygon" || lastEntry.done) {
        const newEntry: DrawingEntry = { type: "polygon", points: [latLng] };
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

        if (!lastEntry || lastEntry.type !== "polygon") return;
        if (!lastLine.current) return;
        if (!e.latLng) return;

        const polyline = new google.maps.Polyline({
          path: [
            lastLine.current
              .getPath()
              .getAt(lastLine.current.getPath().getLength() - 1),
            e.latLng,
          ],
          strokeColor: "#FF0000",
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

        const entryPoints = [...entry.points.slice(0, -1)];
        const polygon = new google.maps.Polygon({
          paths: entryPoints,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          editable: true,
          geodesic: true,
        });
        polygon.setMap(map);
        function changePaths() {
          // remove undo icon
          const undo = document.querySelector(
            'img[src$="undo_poly.png"]',
          ) as HTMLImageElement;
          if (undo) undo.style.display = "none";

          onChange?.({
            ...entry,
            points: [
              ...polygon.getPath().getArray(),
              polygon.getPath().getAt(0),
            ],
          });
        }
        listeners.push(
          google.maps.event.addListener(
            polygon.getPath(),
            "insert_at",
            changePaths,
          ),
        );
        listeners.push(
          google.maps.event.addListener(
            polygon.getPath(),
            "set_at",
            changePaths,
          ),
        );
        return { shape: polygon, listeners };
      } else {
        const polyline = new google.maps.Polyline({
          path: entry.points,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
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

            if (firstPoint?.equals(e.latLng)) {
              onChange?.({
                ...entry,
                points: [...entry.points, firstPoint],
                done: true,
              });
            }
          },
        );
        listeners.push(clickListener);

        // hover listener
        // close the polygon if first point is hovered
        const hoverListener = polyline.addListener(
          "mouseover",
          (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            const firstPoint = polyline.getPath().getAt(0);
            if (firstPoint?.equals(e.latLng) && lineToCursor.current) {
              lineToCursor.current
                .getPath()
                .setAt(
                  lineToCursor.current.getPath().getLength() - 1,
                  firstPoint,
                );
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
