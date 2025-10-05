import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { DrawingEntry } from "./types";

export function useLineDrawing() {
  const map = useMap();

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "line") {
        const newEntry: DrawingEntry = { type: "line", points: [latLng] };
        entries.push(newEntry);
        return entries;
      }

      // Line needs at least 2 points, close after second point
      if (lastEntry.points.length >= 2) {
        const newEntry: DrawingEntry = { type: "line", points: [latLng] };
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
      if (!map || points.length === 0) return;

      const polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        clickable: true,
        editable: true,
      });
      polyline.setMap(map);

      function getPaths() {
        onChange?.(polyline.getPath().getArray());
      }
      google.maps.event.addListener(polyline, "dragend", getPaths);
      google.maps.event.addListener(polyline.getPath(), "insert_at", getPaths);
      google.maps.event.addListener(polyline.getPath(), "remove_at", getPaths);
      google.maps.event.addListener(polyline.getPath(), "set_at", getPaths);
      return polyline;
    },
    [map],
  );

  return {
    draw,
    onClick,
  };
}
