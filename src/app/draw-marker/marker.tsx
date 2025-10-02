"use client";

import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import { Marker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { SimpleMap } from "@/components/maps/simple";

export function DrawMarker() {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);

  function onClick(ev: MapMouseEvent) {
    setCenter(ev.detail.latLng);
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
        <div>Center: {JSON.stringify(center)}</div>
      </div>

      <br />

      <SimpleMap onClick={onClick} height="500px">
        <Marker position={center} />
      </SimpleMap>
    </>
  );
}
