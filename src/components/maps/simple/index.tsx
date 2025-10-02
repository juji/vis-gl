"use client";

/*
https://visgl.github.io/react-google-maps/docs/api-reference/components/map
*/

import {
  APIProvider,
  type ColorScheme,
  Map as GoogleMap,
  type MapCameraChangedEvent,
  type MapEvent,
  type MapMouseEvent,
  RenderingType,
} from "@vis.gl/react-google-maps";

export type SimpleMapProps = {
  // General Props
  id?: string;
  mapId?: string;
  colorScheme?: ColorScheme;
  renderingType?: RenderingType;
  style?: React.CSSProperties;
  className?: string;
  reuseMaps?: boolean;

  // Camera Control (Controlled)
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  heading?: number;
  tilt?: number;

  // Camera Control (Uncontrolled)
  defaultCenter?: google.maps.LatLngLiteral;
  defaultZoom?: number;
  defaultHeading?: number;
  defaultTilt?: number;
  defaultBounds?: google.maps.LatLngBoundsLiteral & {
    padding?: number | google.maps.Padding;
  };
  controlled?: boolean;

  // Map Options (from google.maps.MapOptions)
  backgroundColor?: string;
  clickableIcons?: boolean;
  disableDefaultUI?: boolean;
  disableDoubleClickZoom?: boolean;
  draggable?: boolean;
  draggableCursor?: string;
  draggingCursor?: string;
  fullscreenControl?: boolean;
  fullscreenControlOptions?: google.maps.FullscreenControlOptions;
  gestureHandling?: string;
  isFractionalZoomEnabled?: boolean;
  keyboardShortcuts?: boolean;
  mapTypeControl?: boolean;
  mapTypeControlOptions?: google.maps.MapTypeControlOptions;
  mapTypeId?: string;
  maxZoom?: number;
  minZoom?: number;
  noClear?: boolean;
  panControl?: boolean;
  panControlOptions?: google.maps.PanControlOptions;
  restriction?: google.maps.MapRestriction;
  rotateControl?: boolean;
  rotateControlOptions?: google.maps.RotateControlOptions;
  scaleControl?: boolean;
  scaleControlOptions?: google.maps.ScaleControlOptions;
  scrollwheel?: boolean;
  streetView?: google.maps.StreetViewPanorama;
  streetViewControl?: boolean;
  streetViewControlOptions?: google.maps.StreetViewControlOptions;
  styles?: google.maps.MapTypeStyle[];
  zoomControl?: boolean;
  zoomControlOptions?: google.maps.ZoomControlOptions;

  // Camera Change Events
  onBoundsChanged?: (ev: MapCameraChangedEvent) => void;
  onCameraChanged?: (ev: MapCameraChangedEvent) => void;
  onCenterChanged?: (ev: MapCameraChangedEvent) => void;
  onZoomChanged?: (ev: MapCameraChangedEvent) => void;
  onHeadingChanged?: (ev: MapCameraChangedEvent) => void;
  onTiltChanged?: (ev: MapCameraChangedEvent) => void;

  // Mouse Events
  onClick?: (ev: MapMouseEvent) => void;
  onContextmenu?: (ev: MapMouseEvent) => void;
  onDblclick?: (ev: MapMouseEvent) => void;
  onMousemove?: (ev: MapMouseEvent) => void;
  onMouseover?: (ev: MapMouseEvent) => void;
  onMouseout?: (ev: MapMouseEvent) => void;

  // Drag Events
  onDrag?: (ev: MapEvent) => void;
  onDragend?: (ev: MapEvent) => void;
  onDragstart?: (ev: MapEvent) => void;

  // Other Events
  onIdle?: (ev: MapEvent) => void;
  onProjectionChanged?: (ev: MapEvent) => void;
  onIsFractionalZoomEnabledChanged?: (ev: MapEvent) => void;
  onMapCapabilitiesChanged?: (ev: MapEvent) => void;
  onMapTypeIdChanged?: (ev: MapEvent) => void;
  onRenderingTypeChanged?: (ev: MapEvent) => void;
  onTilesLoaded?: (ev: MapEvent) => void;

  // Custom Props
  width?: string;
  height?: string;
  children?: React.ReactNode;
};

export function SimpleMap(props: SimpleMapProps) {
  const {
    width,
    height,
    children,
    gestureHandling: _,
    reuseMaps: __,
    renderingType = RenderingType.VECTOR,
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
      />
      {children}
    </APIProvider>
  );
}
