import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { DrawingEntry } from "./types";

export function usePolygonDrawing() {
  const map = useMap();

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      console.log("Polygon drawing click at", latLng.toString());
      console.log("Current entries:", entries);
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "polygon") {
        const newEntry: DrawingEntry = { type: "polygon", points: [latLng] };
        return [...entries, newEntry];
      }

      // already closed, create new polygon
      if (
        lastEntry.points[0].equals(
          lastEntry.points[lastEntry.points.length - 1],
        ) &&
        lastEntry.points.length > 2
      ) {
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
      setEntries: (entries: DrawingEntry[]) => void,
    ) => {
      if (!map) return;

      map.setOptions({ draggableCursor: "crosshair" });
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const newEntries = onClick(e.latLng, presentHistoryState);
        setEntries(newEntries);
      });

      return () => {
        map.setOptions({ draggableCursor: "" });
        google.maps.event.clearListeners(map, "click");
      };
    },
    [map, onClick],
  );

  const draw = useCallback(
    (
      points: google.maps.LatLng[],
      onChange?: (points: google.maps.LatLng[]) => void,
      _isLastOfType = false,
    ) => {
      if (!map) return;

      const listeners: google.maps.MapsEventListener[] = [];

      const isClosedPolygon =
        points.length > 2 && points[0].equals(points[points.length - 1]);
      if (isClosedPolygon) {
        const entryPoints = [...points.slice(0, -1)];
        const polygon = new google.maps.Polygon({
          paths: entryPoints,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          editable: true,
        });
        polygon.setMap(map);
        function changePaths() {
          // remove undo icon
          const undo = document.querySelector(
            'img[src$="undo_poly.png"]',
          ) as HTMLImageElement;
          if (undo) undo.style.display = "none";

          onChange?.([
            ...polygon.getPath().getArray(),
            polygon.getPath().getAt(0),
          ]);
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
          path: points,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          editable: true,
        });
        polyline.setMap(map);

        // check if first point is clicked
        // if so, close the polygon
        const clickListener = polyline.addListener(
          "click",
          (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              const firstPoint = polyline.getPath().getAt(0);
              if (firstPoint?.equals(e.latLng)) {
                onChange?.([
                  ...polyline.getPath().getArray(),
                  polyline.getPath().getAt(0),
                ]);
              }
            }
          },
        );
        listeners.push(clickListener);

        function changePaths() {
          // remove undo icon
          const undo = document.querySelector(
            'img[src$="undo_poly.png"]',
          ) as HTMLImageElement;
          if (undo) undo.style.display = "none";

          onChange?.(polyline.getPath().getArray());
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
      }
    },
    [map],
  );

  return {
    draw,
    startListeners,
  };
}
