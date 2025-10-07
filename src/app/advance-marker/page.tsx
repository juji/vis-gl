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

      import {
        AdvancedMarker,
        AdvancedMarkerAnchorPoint,
        InfoWindow,
        Pin,
        useAdvancedMarkerRef,
      } from "@vis.gl/react-google-maps";
      
      // need to undo the dark mode
      // for scrollbar
      import "./info-window.css"; 

      // --

      const [markerRef, marker] = useAdvancedMarkerRef();
      const [infoWindowShown, setInfoWindowShown] = useState(false);

      // --

      <SimpleMap 
        mapId={id}
        height="500px"
      >

        {/* tangerang, red */}
        <AdvancedMarker position={{ lat: -6.178306, lng: 106.631889 }} />

        {/* jakarta, green */}
        <AdvancedMarker 
          ref={markerRef}
          position={{ lat: -6.2, lng: 106.816666 }}
          onClick={handleMarkerClick}
        >
          <Pin
            background={'#0f9d58'}
            borderColor={'#006425'}
            glyphColor={'#60d98f'}
          />
        </AdvancedMarker>

        {infoWindowShown && (
          <InfoWindow
            anchor={marker}
            onCloseClick={handleClose}
            maxWidth={300}
            headerContent={
              <h3 style={{ margin: 0, color: "#000" }}>Jakarta, Indonesia</h3>
            }
            ariaLabel="Jakarta marker information"
          >
            {/* InfoWindow content */}
          </InfoWindow>
        )}

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
