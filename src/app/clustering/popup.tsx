"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
} from "@vis.gl/react-google-maps";
import { type RefObject, useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";

interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string;
  city: string;
  state: string;
  country: string;
}

interface BreweryPopupProps {
  brewery: Brewery | null;
  position: google.maps.LatLngLiteral | null;
  marker: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function BreweryPopup({
  brewery,
  position,
  marker,
  onClose,
}: BreweryPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(
    marker.current
      ? [marker as RefObject<HTMLDivElement>, ref as RefObject<HTMLDivElement>]
      : [ref as RefObject<HTMLDivElement>],
    onClose,
  );

  if (!brewery || !position) return null;

  return (
    <AdvancedMarker
      position={position}
      anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          transform: "translate(-0%, -21px)",
        }}
      >
        <button
          type="button"
          style={{
            background: "linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%)",
            border: "2px solid #9b59b6",
            borderRadius: "8px",
            padding: "12px",
            minWidth: "200px",
            maxWidth: "280px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            zIndex: 1000,
            fontSize: "14px",
            lineHeight: "1.4",
            color: "#e0e0e0",
            pointerEvents: "auto",
            cursor: "pointer",
            outline: "none",
          }}
          onClick={onClose}
        >
          <div
            style={{
              marginBottom: "4px",
              color: "#e0e0e0",
              fontWeight: "bold",
            }}
          >
            {brewery.name}
          </div>
          <div
            style={{
              marginBottom: "4px",
              color: "#a0a0a0",
              fontStyle: "italic",
            }}
          >
            {brewery.brewery_type}
          </div>
          {brewery.address_1 && (
            <div style={{ color: "#b0b0b0", fontSize: "12px" }}>
              {brewery.address_1}
              {brewery.city && `, ${brewery.city}`}
            </div>
          )}
        </button>

        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "0",
            height: "0",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid #2a2a3e",
            borderBottom: "none",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
          }}
        />
      </div>
    </AdvancedMarker>
  );
}
