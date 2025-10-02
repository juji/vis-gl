import { Code } from "@/components/code";
import { DrawMarker } from "./marker";

export default function MarkerPage() {
  return (
    <>
      <h1>Simple Marker</h1>
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

      function onDrag(e: google.maps.MapMouseEvent) {
        setCenter(e.latLng?.toJSON() || null);
      }

      // ...

      <SimpleMap
        onClick={onClick}
        height="500px"
      ><Marker
        position={center} 
        clickable={true}
        draggable={true}
        onDrag={onDrag}
        onClick={() => alert('marker was clicked!')}
        title={'clickable, draggable google.maps.Marker'}
      /></SimpleMap>
    `}</Code>
    </>
  );
}
