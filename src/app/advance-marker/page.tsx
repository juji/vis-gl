import { Code } from "@/components/code";
import { AdvanceMarker } from "./advance-marker";

export default function AdvanceMarkerPage() {
  return (
    <>
      <h1>Advance Marker</h1>
      <p>The blue marker is the custom marker.</p>
      <br />
      <AdvanceMarker />
      <br />
      <Code lang="tsx" clean="      ">{`
      <SimpleMap 
        mapId={id}
        height="500px"
      >

        {/* tangerang, red */}
        <AdvancedMarker position={{ lat: -6.178306, lng: 106.631889 }} />

        {/* jakarta, green */}
        <AdvancedMarker position={{lat: -6.200000, lng: 106.816666}}>
          <Pin
            background={'#0f9d58'}
            borderColor={'#006425'}
            glyphColor={'#60d98f'}
          />
        </AdvancedMarker>

        {/* Bandung, fully customized marker */}
        <AdvancedMarker 
          position={{lat:  -6.914744, lng: 107.609810}}
          anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
          onClick={() => {}} // to make it less noisy on the console
        >
          <CustomMarker title="Custom Marker" />
        </AdvancedMarker>

      </SimpleMap>
    `}</Code>
    </>
  );
}
