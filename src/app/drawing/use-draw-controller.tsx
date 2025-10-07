import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
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

  const listeners = useRef<google.maps.MapsEventListener[]>([]);
  const objects = useRef<
    (
      | google.maps.Polygon
      | google.maps.Polyline
      | google.maps.Circle
      | google.maps.Rectangle
    )[]
  >([]);

  const { draw: drawPolygon, startListeners: startPolygonListeners } =
    usePolygonDrawing();
  const { draw: drawLine, startListeners: startLineListeners } =
    useLineDrawing();
  const { draw: drawCircle, startListeners: startCircleListeners } =
    useCircleDrawing();
  const { draw: drawRectangle, startListeners: startRectangleListeners } =
    useRectangleDrawing();

  useEffect(() => {
    const lastOfTypeIndexPolygon = presentHistoryState.findLastIndex(
      (e) => e.type === "polygon",
    );

    const lastOfTypeIndexLine = presentHistoryState.findLastIndex(
      (e) => e.type === "line",
    );

    presentHistoryState.forEach((entry, idx) => {
      const updateEntry = (newEntry: DrawingEntry) => {
        console.log("updateEntry", newEntry);

        const newEntries = presentHistoryState.map((e) => {
          if (e === entry) {
            return newEntry;
          }
          return e;
        });
        addHistoryEntry(newEntries);
      };

      if (entry.type === "polygon") {
        const isLastOfType = lastOfTypeIndexPolygon === idx;
        const result = drawPolygon(entry, updateEntry, isLastOfType);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      }

      if (entry.type === "line") {
        const isLastOfType = lastOfTypeIndexLine === idx;
        const result = drawLine(entry, updateEntry, isLastOfType);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      }

      if (entry.type === "circle") {
        const result = drawCircle(entry, updateEntry);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      }

      if (entry.type === "rectangle") {
        const result = drawRectangle(entry, updateEntry);
        if (result) {
          objects.current.push(result.shape);
          listeners.current.push(...result.listeners);
        }
      }
    });

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
  }, [
    presentHistoryState,
    addHistoryEntry,
    drawPolygon,
    drawLine,
    drawCircle,
    drawRectangle,
  ]);

  useEffect(() => {
    if (!map) return;
    if (!drawingTool) return;

    let endListeners: (() => void) | undefined;
    if (drawingTool === "polygon") {
      endListeners = startPolygonListeners(
        presentHistoryState,
        addHistoryEntry,
      );
    }

    if (drawingTool === "line") {
      endListeners = startLineListeners(presentHistoryState, addHistoryEntry);
    }

    if (drawingTool === "circle") {
      endListeners = startCircleListeners(presentHistoryState, addHistoryEntry);
    }

    if (drawingTool === "rectangle") {
      endListeners = startRectangleListeners(
        presentHistoryState,
        addHistoryEntry,
      );
    }

    return () => {
      endListeners?.();
    };
  }, [
    map,
    drawingTool,
    presentHistoryState,
    addHistoryEntry,
    startPolygonListeners,
    startLineListeners,
    startCircleListeners,
    startRectangleListeners,
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
