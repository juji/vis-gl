"use client";

import {
  ControlPosition,
  Map as GoogleMap,
  MapControl,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { CircleButton } from "@/components/icon-buttons/circle-button";
import { LineButton } from "@/components/icon-buttons/line-button";
import { PolygonButton } from "@/components/icon-buttons/polygon-button";
import { RectangleButton } from "@/components/icon-buttons/rectangle-button";
import { RedoButton } from "@/components/icon-buttons/redo-button";
import { UndoButton } from "@/components/icon-buttons/undo-button";
import styles from "./drawing.module.css";
import type { DrawingTool } from "./types";
import { useDrawController } from "./use-draw-controller";

export function DrawingMap() {
  const [activeTool, setActiveTool] = useState<DrawingTool>(null);

  const { undo, redo, hasUndo, hasRedo } = useDrawController(activeTool);

  const handleToolSelect = (tool: DrawingTool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  return (
    <GoogleMap
      style={{
        height: "500px",
      }}
      disableDefaultUI={true}
      defaultCenter={{ lat: -6.178306, lng: 106.631889 }}
      defaultZoom={7}
      gestureHandling="greedy"
      reuseMaps={true}
    >
      <MapControl position={ControlPosition.TOP_RIGHT}>
        <div className={styles.drawingToolbar}>
          <PolygonButton
            size={40}
            active={activeTool === "polygon"}
            onClick={() => handleToolSelect("polygon")}
            title="Draw Polygon"
          />
          <LineButton
            size={40}
            active={activeTool === "line"}
            onClick={() => handleToolSelect("line")}
            title="Draw Line"
          />
          <CircleButton
            size={40}
            active={activeTool === "circle"}
            onClick={() => handleToolSelect("circle")}
            title="Draw Circle"
          />
          <RectangleButton
            size={40}
            active={activeTool === "rectangle"}
            onClick={() => handleToolSelect("rectangle")}
            title="Draw Rectangle"
          />
          <UndoButton
            disabled={!hasUndo}
            size={40}
            onClick={undo}
            title="Undo"
          />
          <RedoButton
            disabled={!hasRedo}
            size={40}
            onClick={redo}
            title="Redo"
          />
        </div>
      </MapControl>
    </GoogleMap>
  );
}
