"use client";

import { SimpleMap } from "@/components/maps/simple";

export function CustomUiPlacement() {
  return (
    <SimpleMap
      fullscreenControl={true}
      fullscreenControlOptions={{
        position: google.maps.ControlPosition.BOTTOM_RIGHT,
      }}
      height="500px"
    />
  );
}
