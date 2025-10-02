import { Code } from "@/components/code";
import { DrawMarker } from "./marker";

export default function MarkerPage() {
  return (
    <>
      <h1>Drawing Marker</h1>
      <p>Click to draw Marker</p>
      <br />
      <DrawMarker />
      <br />
      <Code lang="tsx" clean="      ">{`
      import type { MapMouseEvent } from "@vis.gl/react-google-maps";
      import { Marker } from '@vis.gl/react-google-maps';

      // ...

      function onClick(ev: MapMouseEvent) {
        setCenter(ev.detail.latLng);
      }

      // ...

      <SimpleMap
        onClick={onClick}
        height="500px"
      ><Marker position={center} /></SimpleMap>
    `}</Code>
    </>
  );
}
