"use client";

import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

interface MapControlProps {
  lat: number | null;
  lng: number | null;
  zoom: number | null;
}

export function MapControl({ lat, lng, zoom }: MapControlProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (lat !== null && lng !== null) {
      map.panTo({ lat, lng });
    }
  }, [map, lat, lng]);

  useEffect(() => {
    if (!map || zoom === null) return;

    map.setZoom(zoom);
  }, [map, zoom]);

  return null;
}
