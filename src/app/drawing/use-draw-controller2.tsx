import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import type { DrawingEntry, DrawingTool } from "./types";
import { useHistory } from "./use-history";

import { usePolygonDrawing } from "./use-polygon-drawing2";
// import { useCircleDrawing } from "./use-circle-drawing";
// import { useLineDrawing } from "./use-line-drawing";
// import { useRectangleDrawing } from "./use-rectangle-drawing";

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

  useEffect(() => {
    const lastOfTypeIndexPolygon = presentHistoryState.findLastIndex(
      (e) => e.type === "polygon",
    );

    presentHistoryState.forEach((entry, idx) => {
      const updateEntry = (newPoints: google.maps.LatLng[]) => {
        const newEntries = presentHistoryState.map((e) => {
          if (e === entry) {
            return { ...e, points: newPoints };
          }
          return e;
        });
        addHistoryEntry(newEntries);
      };

      if (entry.type === "polygon") {
        const isLastOfType = lastOfTypeIndexPolygon === idx;
        const result = drawPolygon(entry.points, updateEntry, isLastOfType);
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
  }, [presentHistoryState, addHistoryEntry, drawPolygon]);

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

    return () => {
      endListeners?.();
    };
  }, [
    map,
    drawingTool,
    presentHistoryState,
    addHistoryEntry,
    startPolygonListeners,
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
