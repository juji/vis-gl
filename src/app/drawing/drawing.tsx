"use client";

import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { CircleButton } from "@/components/icon-buttons/circle-button";
import { LineButton } from "@/components/icon-buttons/line-button";
import { PolygonButton } from "@/components/icon-buttons/polygon-button";
import { RectangleButton } from "@/components/icon-buttons/rectangle-button";
import { SimpleMap } from "@/components/maps/simple";
import styles from "./drawing.module.css";

type DrawingTool = "polygon" | "line" | "circle" | "rectangle" | null;

export function Drawing() {
  const [activeTool, setActiveTool] = useState<DrawingTool>(null);

  const handleToolSelect = (tool: DrawingTool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  return (
    <>
      <SimpleMap height="500px">
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <div className={styles.drawingToolbar}>
            <PolygonButton
              size={40}
              active={activeTool === "polygon"}
              onClick={() => handleToolSelect("polygon")}
            />
            <LineButton
              size={40}
              active={activeTool === "line"}
              onClick={() => handleToolSelect("line")}
            />
            <CircleButton
              size={40}
              active={activeTool === "circle"}
              onClick={() => handleToolSelect("circle")}
            />
            <RectangleButton
              size={40}
              active={activeTool === "rectangle"}
              onClick={() => handleToolSelect("rectangle")}
            />
          </div>
        </MapControl>
      </SimpleMap>
    </>
  );
}
