"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
} from "@vis.gl/react-google-maps";

interface ClusterMarkerProps {
  count: number;
  position: google.maps.LatLngLiteral;
  onClick?: () => void;
}

export function ClusterMarker({
  count,
  position,
  onClick,
}: ClusterMarkerProps) {
  return (
    <AdvancedMarker
      position={position}
      onClick={onClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "14px",
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(255, 107, 107, 0.4)",
          cursor: onClick ? "pointer" : "default",
          minWidth: "24px",
          minHeight: "24px",
        }}
      >
        {count}
      </div>
    </AdvancedMarker>
  );
}
