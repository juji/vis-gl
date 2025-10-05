import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { DrawingEntry } from "./types";

export function useRectangleDrawing() {
  const map = useMap();

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "rectangle") {
        const newEntry: DrawingEntry = { type: "rectangle", points: [latLng] };
        return [...entries, newEntry];
      }

      // Rectangle needs exactly 2 points (opposite corners)
      if (lastEntry.points.length >= 2) {
        const newEntry: DrawingEntry = { type: "rectangle", points: [latLng] };
        return [...entries, newEntry];
      }

      // add the opposite corner
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
      if (!map || points.length < 2) return;

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(points[0]);
      bounds.extend(points[1]);

      const rectangle = new google.maps.Rectangle({
        bounds: bounds,
        strokeColor: "#FF00FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF00FF",
        fillOpacity: 0.35,
        clickable: true,
        editable: true,
      });
      rectangle.setMap(map);

      const listeners: google.maps.MapsEventListener[] = [];

      function updatePoints() {
        const newBounds = rectangle.getBounds();
        if (newBounds) {
          const ne = newBounds.getNorthEast();
          const sw = newBounds.getSouthWest();
          onChange?.([sw, ne]);
        }
      }
      listeners.push(
        google.maps.event.addListener(
          rectangle,
          "bounds_changed",
          updatePoints,
        ),
      );
      return { shape: rectangle, listeners };
    },
    [map],
  );

  return {
    draw,
    startListeners,
  };
}
