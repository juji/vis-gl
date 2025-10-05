import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import type { DrawingEntry, DrawingTool } from "./types";
import { useCircleDrawing } from "./use-circle-drawing";
import { useHistory } from "./use-history";
import { useLineDrawing } from "./use-line-drawing";
import { usePolygonDrawing } from "./use-polygon-drawing";
import { useRectangleDrawing } from "./use-rectangle-drawing";

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
  const listeners = useRef<google.maps.MapsEventListener[]>([]);

  const { draw: drawPolygon, onClick: onPolygonClick } = usePolygonDrawing();
  const { draw: drawLine, onClick: onLineClick } = useLineDrawing();
  const { draw: drawCircle, onClick: onCircleClick } = useCircleDrawing();
  const { draw: drawRectangle, onClick: onRectangleClick } =
    useRectangleDrawing();

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

    console.log("presentHistoryState:", presentHistoryState);

    presentHistoryState.forEach((entry) => {
      const updateEntry = (newPoints: google.maps.LatLng[]) => {
        const newEntries = presentHistoryState.map((e) => {
          if (e === entry) {
            return { ...e, points: newPoints };
          }
          return e;
        });
        setEntries(newEntries);
      };

      if (entry.type === "polygon") {
        const result = drawPolygon(entry.points, updateEntry);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      } else if (entry.type === "line") {
        const result = drawLine(entry.points, updateEntry);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      } else if (entry.type === "circle") {
        const result = drawCircle(entry.points, updateEntry);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      } else if (entry.type === "rectangle") {
        const result = drawRectangle(entry.points, updateEntry);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      }
    });
  }, [presentHistoryState, drawPolygon, drawLine, drawCircle, drawRectangle]);

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
        const newEntries = onPolygonClick(e.latLng, presentHistoryState);
        console.log("Polygon drawing entries:", newEntries);
        newEntries && setEntries([...newEntries]);
      } else if (drawingTool === "line") {
        const newEntries = onLineClick(e.latLng, presentHistoryState);
        console.log("Line drawing entries:", newEntries);
        newEntries && setEntries([...newEntries]);
      } else if (drawingTool === "circle") {
        const newEntries = onCircleClick(e.latLng, presentHistoryState);
        console.log("Circle drawing entries:", newEntries);
        newEntries && setEntries([...newEntries]);
      } else if (drawingTool === "rectangle") {
        const newEntries = onRectangleClick(e.latLng, presentHistoryState);
        console.log("Rectangle drawing entries:", newEntries);
        newEntries && setEntries([...newEntries]);
      }
    });

    return () => {
      map.setOptions({ draggableCursor: "" });
      google.maps.event.clearListeners(map, "click");
    };
  }, [
    map,
    drawingTool,
    presentHistoryState,
    onPolygonClick,
    onLineClick,
    onCircleClick,
    onRectangleClick,
  ]);

  // Cleanup effect to remove all listeners and objects on unmount
  useEffect(() => {
    return () => {
      // Clear objects
      objects.current.forEach((obj) => {
        obj.setMap(null);
      });
      // Clear listeners
      listeners.current.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
      objects.current = [];
      listeners.current = [];
    };
  }, []);

  // This hook can be expanded to manage drawing state if needed
  return {
    undo,
    redo,
    hasUndo,
    hasRedo,
  };
}
