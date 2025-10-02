"use client";

import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { SimpleMap } from "@/components/maps/simple";

export function Changes() {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(
    null,
  );

  function onCenterChanged(ev: MapCameraChangedEvent) {
    setCenter(ev.detail.center);
  }

  function onZoomChanged(ev: MapCameraChangedEvent) {
    setZoom(ev.detail.zoom);
  }

  function onBoundsChanged(ev: MapCameraChangedEvent) {
    setBounds(ev.detail.bounds);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontFamily: "monospace",
          fontSize: "14px",
          overflow: "auto",
        }}
      >
        <div>
          <b>Note the initial values</b>
        </div>
        <div>Zoom: {zoom === null ? "null" : zoom}</div>
        <div>Center: {JSON.stringify(center)}</div>
        <div>
          Bounds: <pre>{JSON.stringify(bounds, null, 2)}</pre>
        </div>
      </div>

      <br />

      <SimpleMap
        onCenterChanged={onCenterChanged}
        onZoomChanged={onZoomChanged}
        onBoundsChanged={onBoundsChanged}
        height="500px"
      />
    </>
  );
}
