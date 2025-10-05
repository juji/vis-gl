import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { DrawingEntry } from "./types";

export function usePolygonDrawing() {
  const map = useMap();

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "polygon") {
        const newEntry: DrawingEntry = { type: "polygon", points: [latLng] };
        entries.push(newEntry);
        return entries;
      }

      // already closed, create new polygon
      if (
        lastEntry.points[0].equals(
          lastEntry.points[lastEntry.points.length - 1],
        ) &&
        lastEntry.points.length > 2
      ) {
        const newEntry: DrawingEntry = { type: "polygon", points: [latLng] };
        entries.push(newEntry);
        return entries;
      }

      // add the point
      entries[entries.length - 1].points.push(latLng);
      return entries;
    },
    [],
  );

  const draw = useCallback(
    (
      points: google.maps.LatLng[],
      onChange?: (points: google.maps.LatLng[]) => void,
    ) => {
      if (!map) return;

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
          clickable: true,
          editable: true,
        });
        polygon.setMap(map);
        function getPaths() {
          onChange?.([
            ...polygon.getPath().getArray(),
            points[points.length - 1],
          ]);
        }
        google.maps.event.addListener(polygon, "dragend", getPaths);
        google.maps.event.addListener(polygon.getPath(), "insert_at", getPaths);
        google.maps.event.addListener(polygon.getPath(), "remove_at", getPaths);
        google.maps.event.addListener(polygon.getPath(), "set_at", getPaths);
        return polygon;
      } else {
        const polyline = new google.maps.Polyline({
          path: points,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          clickable: true,
          editable: true,
        });
        polyline.setMap(map);
        polyline.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            // check if first point is clicked
            // if so, close the polygon
            const firstPoint = polyline.getPath().getAt(0);
            if (firstPoint?.equals(e.latLng)) {
              onChange?.([
                ...polyline.getPath().getArray(),
                polyline.getPath().getAt(0),
              ]);
            }
          }
        });

        function getPaths() {
          onChange?.(polyline.getPath().getArray());
        }
        google.maps.event.addListener(polyline, "dragend", getPaths);
        google.maps.event.addListener(
          polyline.getPath(),
          "insert_at",
          getPaths,
        );
        google.maps.event.addListener(
          polyline.getPath(),
          "remove_at",
          getPaths,
        );
        google.maps.event.addListener(polyline.getPath(), "set_at", getPaths);
        return polyline;
      }
    },
    [map],
  );

  return {
    draw,
    onClick,
  };
}
