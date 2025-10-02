import { Code } from "@/components/code";
import { Changes } from "./changes";

export default function TrackingChanges() {
  return (
    <>
      <h1>Tracking Changes</h1>
      <p>Track changes in the map, like center, zoom, bounds, etc.</p>
      <br />
      <Changes />
      <br />
      <Code lang="tsx" clean="      ">{`
      import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";

      // ...

      function onCenterChanged(ev: MapCameraChangedEvent) {
        setCenter(ev.detail.center);
      }
    
      function onZoomChanged(ev: MapCameraChangedEvent) {
        setZoom(ev.detail.zoom);
      }
    
      function onBoundsChanged(ev: MapCameraChangedEvent) {
        setBounds(ev.detail.bounds);
      }

      // ...

      <SimpleMap
        onCenterChanged={onCenterChanged}
        onZoomChanged={onZoomChanged}
        onBoundsChanged={onBoundsChanged}
        height="500px"
      />
    `}</Code>
    </>
  );
}
