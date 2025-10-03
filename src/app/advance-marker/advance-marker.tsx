"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  Pin,
} from "@vis.gl/react-google-maps";
import { useId } from "react";
import CustomMarker from "@/components/custom-marker";
import { SimpleMap } from "@/components/maps/simple";

export function AdvanceMarker() {
  const id = useId();

  return (
    <SimpleMap
      mapId={id}
      height="500px"
      defaultCenter={{ lat: -4.9317714736442, lng: 107.43389088305503 }}
      // onCenterChanged={(e) => {
      //   console.log(e.map.getCenter().toJSON());
      // }}
    >
      {/* tangerang, red */}
      <AdvancedMarker position={{ lat: -6.178306, lng: 106.631889 }} />

      {/* jakarta, green */}
      <AdvancedMarker position={{ lat: -6.2, lng: 106.816666 }}>
        <Pin
          background={"#0f9d58"}
          borderColor={"#006425"}
          glyphColor={"#60d98f"}
        />
      </AdvancedMarker>

      {/* fully customized marker */}
      <AdvancedMarker
        position={{ lat: -6.914744, lng: 107.60981 }}
        anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
        onClick={() => {}}
      >
        <CustomMarker title="Custom Marker" />
      </AdvancedMarker>
    </SimpleMap>
  );
}
