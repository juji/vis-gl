import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useRef } from "react";
import type { DrawingEntry } from "./types";

export function useLineDrawing() {
  const map = useMap();
  const addPoint = useRef(false);

  const addPointToLine = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "line") {
        console.warn("No line to add point to");
        return entries;
      }
      return [
        ...entries.slice(0, -1),
        {
          ...lastEntry,
          points: [...lastEntry.points, latLng],
        },
      ];
    },
    [],
  );

  const createNewLine = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const newEntry: DrawingEntry = { type: "line", points: [latLng] };
      return [...entries, newEntry];
    },
    [],
  );

  const startListeners = useCallback(
    (
      presentHistoryState: DrawingEntry[],
      setEntries: (entries: DrawingEntry[]) => void,
    ) => {
      if (!map) return;

      map.setOptions({ draggableCursor: "crosshair" });
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        console.log("Line drawing click at", e.latLng.toString());

        if (!addPoint.current) {
          addPoint.current = true;
          const newEntries = createNewLine(e.latLng, presentHistoryState);
          setEntries(newEntries);
        } else {
          const newEntries = addPointToLine(e.latLng, presentHistoryState);
          setEntries(newEntries);
        }
      });

      // map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
      // });

      return () => {
        map.setOptions({ draggableCursor: "" });
        google.maps.event.clearListeners(map, "click");
        google.maps.event.clearListeners(map, "mousemove");
      };
    },
    [map, addPointToLine, createNewLine],
  );

  const draw = useCallback(
    (
      points: google.maps.LatLng[],
      onChange?: (points: google.maps.LatLng[]) => void,
      isLastOfType = false,
    ) => {
      if (!map || points.length === 0) return;

      console.log("Drawing line with points:", points, isLastOfType);

      const isCLosed = points[0].equals(points[points.length - 1]);
      const firstPointInit = new google.maps.LatLng(points[0]);

      const polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#0000FF",
        strokeOpacity: isLastOfType && addPoint.current ? 0.4 : 0.8,
        strokeWeight: 3,
        editable: true,
      });

      polyline.setMap(map);

      const listeners: google.maps.MapsEventListener[] = [];

      const clickListener = polyline.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            // check if the last point or first point is clicked
            const path = polyline.getPath();
            const lastPoint = path.getAt(path.getLength() - 1);
            const firstPoint = path.getAt(0);
            if (lastPoint?.equals(e.latLng)) {
              // finish the line drawing
              addPoint.current = false;
              onChange?.(path.getArray());
            } else if (firstPoint?.equals(e.latLng)) {
              // connect last point to first point
              path.push(firstPoint);
              addPoint.current = false;
              onChange?.(path.getArray());
            }
          }
        },
      );
      listeners.push(clickListener);

      function changePath() {
        // remove undo icon
        const undo = document.querySelector(
          'img[src$="undo_poly.png"]',
        ) as HTMLImageElement;
        if (undo) undo.style.display = "none";

        const path = polyline.getPath();
        const lastPoint = path.getAt(path.getLength() - 1);
        const firstPoint = path.getAt(0);

        if (isCLosed) {
          if (
            !lastPoint?.equals(firstPointInit) &&
            firstPoint?.equals(firstPointInit)
          ) {
            path.setAt(0, lastPoint);
          }

          if (
            !firstPoint?.equals(firstPointInit) &&
            lastPoint?.equals(firstPointInit)
          ) {
            path.setAt(path.getLength() - 1, firstPoint);
          }
        }
        onChange?.(polyline.getPath().getArray());
      }

      listeners.push(
        google.maps.event.addListener(
          polyline.getPath(),
          "insert_at",
          changePath,
        ),
      );

      listeners.push(
        google.maps.event.addListener(polyline.getPath(), "set_at", changePath),
      );
      return { shape: polyline, listeners };
    },
    [map],
  );

  return {
    draw,
    startListeners,
  };
}
