import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import type { DrawingEntry, DrawingTool } from "./types";
import { useHistory } from "./use-history";
import { usePolygonDrawing } from "./use-polygon-drawing";

export function useDrawController(drawingTool: DrawingTool) {
  const map = useMap();

  const {
    undo,
    redo,
    addEntry: addHistoryEntry,
    hasUndo,
    hasRedo,
    present: presentHistoryState,
  } = useHistory<DrawingEntry>();

  const [entries, setEntries] = useState<DrawingEntry[]>([]);
  const objects = useRef<
    (
      | google.maps.Polygon
      | google.maps.Polyline
      | google.maps.Circle
      | google.maps.Rectangle
    )[]
  >([]);

  const { draw: drawPolygon, onClick: onPolygonClick } = usePolygonDrawing();

  // Save to history
  // biome-ignore lint/correctness/useExhaustiveDependencies: will loop on every change
  useEffect(() => {
    if (entries.length === 0) return;
    const entryCopy = entries.map((v) => ({
      type: v.type,
      points: [...v.points],
    }));
    addHistoryEntry(entryCopy);
  }, [entries]);

  useEffect(() => {
    // Clear existing objects
    objects.current.forEach((obj) => {
      obj.setMap(null);
    });

    objects.current = [];

    presentHistoryState.forEach((entry) => {
      if (entry.type === "polygon") {
        const polygon = drawPolygon(
          entry.points,
          (newPoints: google.maps.LatLng[]) => {
            const newEntries = presentHistoryState.map((e) => {
              if (e === entry) {
                return { ...e, points: newPoints };
              }
              return e;
            });
            setEntries(newEntries);
          },
        );
        polygon && objects.current.push(polygon);
      }
      // Implement other shapes (line, circle, rectangle) similarly
    });
  }, [presentHistoryState, drawPolygon]);

  useEffect(() => {
    if (!map) return;
    if (!drawingTool) {
      map.setOptions({ draggableCursor: "" });
      google.maps.event.clearListeners(map, "click");
      return;
    }

    map.setOptions({ draggableCursor: "crosshair" });
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      if (drawingTool === "polygon") {
        const newEntries = onPolygonClick(e.latLng, entries);
        console.log("Polygon drawing entries:", newEntries);
        newEntries && setEntries([...newEntries]);
      }
    });

    return () => {
      map.setOptions({ draggableCursor: "" });
      google.maps.event.clearListeners(map, "click");
    };
  }, [map, drawingTool, entries, onPolygonClick]);

  // This hook can be expanded to manage drawing state if needed
  return {
    undo,
    redo,
    hasUndo,
    hasRedo,
  };
}
