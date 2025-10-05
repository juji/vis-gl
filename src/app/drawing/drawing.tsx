"use client";

import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { CircleButton } from "@/components/icon-buttons/circle-button";
import { LineButton } from "@/components/icon-buttons/line-button";
import { PolygonButton } from "@/components/icon-buttons/polygon-button";
import { RectangleButton } from "@/components/icon-buttons/rectangle-button";
import { RedoButton } from "@/components/icon-buttons/redo-button";
import { UndoButton } from "@/components/icon-buttons/undo-button";
import { SimpleMap } from "@/components/maps/simple";
import styles from "./drawing.module.css";
import { DrawController, type DrawingTool } from "./draw-controller";

export function Drawing() {
  const [activeTool, setActiveTool] = useState<DrawingTool>(null);

  const handleToolSelect = (tool: DrawingTool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  return (
    <>
      <SimpleMap height="500px">
        <DrawController drawingTool={activeTool} />
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
              size={40}
              onClick={() => console.log("Undo")}
              title="Undo"
            />
            <RedoButton
              size={40}
              onClick={() => console.log("Redo")}
              title="Redo"
            />
          </div>
        </MapControl>
      </SimpleMap>
    </>
  );
}
