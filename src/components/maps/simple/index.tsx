"use client";

import {
  APIProvider,
  Map as GoogleMap,
  type MapProps,
  RenderingType,
} from "@vis.gl/react-google-maps";

type SimpleMapProps = MapProps & {
  width?: string;
  height?: string;
};

export function SimpleMap(props: SimpleMapProps) {
  const {
    width,
    height,
    children,
    renderingType = RenderingType.VECTOR,

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
      >
        {children}
      </GoogleMap>
    </APIProvider>
  );
}
