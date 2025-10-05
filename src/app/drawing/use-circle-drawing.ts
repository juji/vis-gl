import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { DrawingEntry } from "./types";

export function useCircleDrawing() {
  const map = useMap();

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "circle") {
        const newEntry: DrawingEntry = { type: "circle", points: [latLng] };
        return [...entries, newEntry];
      }

      // Circle needs exactly 2 points (center and radius point)
      if (lastEntry.points.length >= 2) {
        const newEntry: DrawingEntry = { type: "circle", points: [latLng] };
        return [...entries, newEntry];
      }

      // add the radius point
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

  const draw = useCallback(
    (
      points: google.maps.LatLng[],
      onChange?: (points: google.maps.LatLng[]) => void,
    ) => {
      if (!map || points.length < 2) return;

      const center = points[0];
      const radiusPoint = points[1];
      const radius = google.maps.geometry.spherical.computeDistanceBetween(
        center,
        radiusPoint,
      );

      const circle = new google.maps.Circle({
        center: center,
        radius: radius,
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.35,
        clickable: true,
        editable: true,
      });
      circle.setMap(map);

      const listeners: google.maps.MapsEventListener[] = [];

      function updatePoints() {
        const newCenter = circle.getCenter();
        const newRadius = circle.getRadius();
        if (newCenter) {
          const radiusLat = newCenter.lat() + newRadius / 111320; // Approximate meters to degrees
          const newRadiusPoint = new google.maps.LatLng(
            radiusLat,
            newCenter.lng(),
          );
          onChange?.([newCenter, newRadiusPoint]);
        }
      }
      listeners.push(
        google.maps.event.addListener(circle, "center_changed", updatePoints),
      );
      listeners.push(
        google.maps.event.addListener(circle, "radius_changed", updatePoints),
      );

      return { shape: circle, listeners };
    },
    [map],
  );

  return {
    draw,
    onClick,
  };
}
