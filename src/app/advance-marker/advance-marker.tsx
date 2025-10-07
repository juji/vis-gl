"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useId, useState } from "react";
import CustomMarker from "@/components/custom-marker";
import { SimpleMap } from "@/components/maps/simple";
import "./info-window.css";

export function AdvanceMarker() {
  const id = useId();

  // Jakarta marker with InfoWindow - following recommended pattern
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    [],
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <SimpleMap
      mapId={id}
      height="500px"
      defaultCenter={{ lat: -4.9317714736442, lng: 107.43389088305503 }}
      // onCenterChanged={(e) => {
      //   console.log(e.map.getCenter().toJSON());
      // }}
    >
      {/* tangerang, red */}
      <AdvancedMarker position={{ lat: -6.178306, lng: 106.631889 }} />

      {/* jakarta, green - InfoWindow attached to marker */}
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: -6.2, lng: 106.816666 }}
        onClick={handleMarkerClick}
      >
        <Pin
          background={"#0f9d58"}
          borderColor={"#006425"}
          glyphColor={"#60d98f"}
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
          <div
            style={{
              fontSize: "14px",
              color: "#000",
              backgroundColor: "#fff",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                color: "#666",
              }}
            >
              Capital City
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#333",
              }}
            >
              Jakarta is the capital and largest city of Indonesia. Located on
              the northwest coast of Java, it serves as the country's political,
              economic, and cultural center.
              <br />
              <br />
              With over 10 million inhabitants, Jakarta is one of the most
              populous cities in the world. The city is known for its vibrant
              business district, rich cultural heritage, and diverse culinary
              scene.
              <br />
              <br />
              Key attractions include the National Monument (Monas), Old Town
              (Kota Tua), and the Grand Indonesia shopping mall. The city is
              also home to numerous museums, parks, and cultural sites.
              <br />
              <br />
              Jakarta's economy is diverse, with major industries including
              finance, manufacturing, and services. The city hosts the Indonesia
              Stock Exchange and serves as headquarters for many multinational
              corporations.
              <br />
              <br />
              The transportation system includes buses, trains, and the
              TransJakarta rapid transit system. Jakarta is also known for its
              traffic congestion and ongoing urban development projects.
              <br />
              <br />
              Climate: Jakarta has a tropical monsoon climate with high humidity
              year-round. The dry season runs from May to September, while the
              wet season occurs from October to April.
            </p>
          </div>
        </InfoWindow>
      )}

      {/* fully customized marker */}
      <AdvancedMarker
        position={{ lat: -6.914744, lng: 107.60981 }}
        anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
        onClick={() => {}}
      >
        <CustomMarker title="Custom Marker" />
      </AdvancedMarker>
    </SimpleMap>
  );
}
