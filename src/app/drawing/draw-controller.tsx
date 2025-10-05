import { useCallback, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export type DrawingTool = "polygon" | "line" | "circle" | "rectangle" | null;

export function DrawController({
  drawingTool,
}:{
  drawingTool: DrawingTool,
}) {

  const map = useMap();

  const initializePolygonDrawing = useCallback(() => {
    if (!map) return;
    map.setOptions({ draggableCursor:'crosshair' });
  }, [map]);

  const initializeLineDrawing = useCallback(() => {
    if (!map) return;
  }, [map]);

  const initializeCircleDrawing = useCallback(() => {
    if (!map) return;
  }, [map]);
  
  const initializeRectangleDrawing = useCallback(() => {
    if (!map) return;
  }, [map]);

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

  },[drawingTool, map])

  return null;
  
}