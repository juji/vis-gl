"use client";

import { ControlPosition } from "@vis.gl/react-google-maps";
import { SimpleMap } from "@/components/maps/simple";

export function CustomUiPlacement() {
  return (
    <SimpleMap
      mapId={"custom-ui-placement-map"}
      fullscreenControl={true}
      fullscreenControlOptions={{
        position: ControlPosition.BOTTOM_RIGHT,
      }}
      height="500px"
    />
  );
}
