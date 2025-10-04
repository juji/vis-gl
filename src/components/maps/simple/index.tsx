"use client";

import {
  APIProvider,
  Map as GoogleMap,
  type MapCameraChangedEvent,
  type MapProps,
  RenderingType,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

type SimpleMapProps = MapProps & {
  width?: string;
  height?: string;
  onCameraChanged?: (event: MapCameraChangedEvent) => void;
};

export function SimpleMap(props: SimpleMapProps) {
  const {
    width,
    height,
    children,
    renderingType = RenderingType.VECTOR,
    onCameraChanged,

    // tangerang, banten, indonesia
    defaultCenter = { lat: -6.178306, lng: 106.631889 },

    defaultZoom = 7,
    disableDefaultUI = true,
    ...mapProps
  } = props;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <GoogleMap
        {...mapProps}
        renderingType={renderingType}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        disableDefaultUI={disableDefaultUI}
        style={{
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        }}
        gestureHandling="greedy"
        reuseMaps={true}
        onCameraChanged={onCameraChanged}
      >
        {children}
      </GoogleMap>
    </APIProvider>
  );
}
