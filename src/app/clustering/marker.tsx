"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
} from "@vis.gl/react-google-maps";

interface MarkerProps {
  position: google.maps.LatLngLiteral;
  onClick?: () => void;
  brewery: { id: string };
}

export function Marker({ position, onClick, brewery }: MarkerProps) {
  return (
    <AdvancedMarker
      position={position}
      onClick={onClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <div
        id={`marker-${brewery.id}`}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(155, 89, 182, 0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
        >
          <title>Beer Glass Icon</title>
          {/* Beer glass body */}
          <path
            d="M6 1h8v14c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V1z"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
          />
          {/* Glass rim */}
          <path
            d="M4 1h12v1H4V1z"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
          />
          {/* Handle */}
          <path
            d="M14 6c2 0 3 1 3 3s-1 3-3 3"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Foam */}
          <path d="M5 3h10v2H5V3z" fill="white" opacity="0.8" />
        </svg>
      </div>
    </AdvancedMarker>
  );
}
