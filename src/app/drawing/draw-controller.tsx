import { useCallback, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export type DrawingTool = "polygon" | "line" | "circle" | "rectangle" | null;

export function useDrawController( drawingTool: DrawingTool ) {

  const map = useMap();

  const initializePolygonDrawing = useCallback(() => {
    if (!map) return;
    map.setOptions({ draggableCursor:'crosshair' });
  }, [ map ]);

  const initializeLineDrawing = useCallback(() => {
    if (!map) return;
    map.setOptions({ draggableCursor:'crosshair' });
  }, [ map ]);

  const initializeCircleDrawing = useCallback(() => {
    if (!map) return;
    map.setOptions({ draggableCursor:'crosshair' });
  }, [ map ]);
  
  const initializeRectangleDrawing = useCallback(() => {
    if (!map) return;
    map.setOptions({ draggableCursor:'crosshair' });
  }, [ map ]);

  useEffect(() => {
    if (!map) return;

    switch (drawingTool) {
      case "polygon":
        initializePolygonDrawing();
        break;
      case "line":
        initializeLineDrawing();
        break;
      case "circle":
        initializeCircleDrawing();
        break;
      case "rectangle":
        initializeRectangleDrawing();
        break;
      default:
        break;
    }

  },[
    map, drawingTool,
    initializePolygonDrawing, 
    initializeLineDrawing, 
    initializeCircleDrawing, 
    initializeRectangleDrawing
  ])

  const undo = useCallback(() => {
    if (!map) return;
    console.log("Undo action");
  }, [map]);

  const redo = useCallback(() => {
    if (!map) return;
    console.log("Redo action");
  }, [map]);

  // This hook can be expanded to manage drawing state if needed
  return {
    undo,
    redo,
    drawingTool
  };
}