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
    clean: historyClean,
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

  const { draw: drawPolygon, startListeners: startPolygonListeners } =
    usePolygonDrawing();
  const { draw: drawLine, startListeners: startLineListeners } =
    useLineDrawing();
  const { draw: drawCircle, startListeners: startCircleListeners } =
    useCircleDrawing();
  const { draw: drawRectangle, startListeners: startRectangleListener } =
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

    // clear existing listeners
    listeners.current.forEach((listener) => {
      google.maps.event.removeListener(listener);
    });

    listeners.current = [];
    objects.current = [];

    const lastOfTypeIndexPolygon = presentHistoryState.findLastIndex(
      (e) => e.type === "polygon",
    );
    const lastOfTypeIndexLine = presentHistoryState.findLastIndex(
      (e) => e.type === "line",
    );
    const lastOfTypeIndexCircle = presentHistoryState.findLastIndex(
      (e) => e.type === "circle",
    );
    const lastOfTypeIndexRectangle = presentHistoryState.findLastIndex(
      (e) => e.type === "rectangle",
    );

    presentHistoryState.forEach((entry, idx) => {
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
        const isLastOfType = lastOfTypeIndexPolygon === idx;
        const result = drawPolygon(entry.points, updateEntry, isLastOfType);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      } else if (entry.type === "line") {
        const isLastOfType = lastOfTypeIndexLine === idx;
        const result = drawLine(entry.points, updateEntry, isLastOfType);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      } else if (entry.type === "circle") {
        const isLastOfType = lastOfTypeIndexCircle === idx;
        const result = drawCircle(entry.points, updateEntry, isLastOfType);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      } else if (entry.type === "rectangle") {
        const isLastOfType = lastOfTypeIndexRectangle === idx;
        const result = drawRectangle(entry.points, updateEntry, isLastOfType);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      }
    });
  }, [presentHistoryState, drawPolygon, drawLine, drawCircle, drawRectangle]);

  useEffect(() => {
    if (!map) return;
    if (!drawingTool) return;

    let endListeners: (() => void) | undefined;
    if (drawingTool === "polygon") {
      endListeners = startPolygonListeners(presentHistoryState, setEntries);
    } else if (drawingTool === "line") {
      endListeners = startLineListeners(presentHistoryState, setEntries);
    } else if (drawingTool === "circle") {
      endListeners = startCircleListeners(presentHistoryState, setEntries);
    } else if (drawingTool === "rectangle") {
      endListeners = startRectangleListener(presentHistoryState, setEntries);
    }

    return () => {
      endListeners?.();
    };
  }, [
    map,
    drawingTool,
    presentHistoryState,
    startPolygonListeners,
    startLineListeners,
    startCircleListeners,
    startRectangleListener,
  ]);

  // Cleanup effect to remove all listeners and objects on unmount
  // biome-ignore lint/correctness/useExhaustiveDependencies: want to run only on unmount
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

      historyClean();
    };
  }, []);

  //
  return {
    undo,
    redo,
    hasUndo,
    hasRedo,
  };
}
