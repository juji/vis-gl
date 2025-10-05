"use client";

import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useState } from "react";
import CircleButton from "@/components/icons/circle-button";
import LineButton from "@/components/icons/line-button";
import PolygonButton from "@/components/icons/polygon-button";
import RectangleButton from "@/components/icons/rectangle-button";
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
