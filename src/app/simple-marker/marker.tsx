"use client";

import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import { Marker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { SimpleMap } from "@/components/maps/simple";

export function DrawMarker() {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null,
  );

  function onClick(ev: MapMouseEvent) {
    setLocation(ev.detail.latLng);
  }

  function onDrag(e: google.maps.MapMouseEvent) {
    setLocation(e.latLng?.toJSON() || null);
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
          <b>Note the initial values, You can drag and click.</b>
        </div>
        <div>Location: {JSON.stringify(location)}</div>
      </div>

      <br />

      <SimpleMap onClick={onClick} height="500px">
        <Marker
          position={location}
          clickable={true}
          draggable={true}
          onDrag={onDrag}
          onClick={() => alert("marker was clicked!")}
          title={"clickable, draggable google.maps.Marker"}
        />
      </SimpleMap>
    </>
  );
}
