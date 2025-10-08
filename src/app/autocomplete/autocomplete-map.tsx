"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import Autocomplete, {
  type AutocompleteOption,
} from "@/components/autocomplete";
import styles from "./autocomplete-map.module.css";

interface BreweryLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  address?: string;
}

interface BreweryData extends AutocompleteOption {
  brewery_type?: string;
  location: BreweryLocation;
  contact: {
    phone?: string;
    website_url?: string;
  };
}

async function fetchBreweries(query: string): Promise<BreweryData[]> {
  const response = await fetch(
    `/api/brewery/search?query=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch breweries");
  }
  return response.json();
}

export function AutocompleteMap() {
  const map = useMap();
  const [selectedBrewery, setSelectedBrewery] = useState<BreweryData | null>(
    null,
  );

  const handleBrewerySelect = useCallback(
    (option: AutocompleteOption) => {
      const brewery = option as BreweryData;
      setSelectedBrewery(brewery);

      // Update map center and zoom if brewery has coordinates
      if (brewery.location.latitude && brewery.location.longitude && map) {
        // make it offcenter so it wont be hidden under the description box
        map.setCenter({
          lat: brewery.location.latitude + 0.004, // slight offset downwards
          lng: brewery.location.longitude,
        });
        map.setZoom(15); // Zoom in to show the brewery location
      }

      console.log("Selected brewery:", brewery);
    },
    [map],
  );

  return (
    <div className={styles.container}>
      {/* Autocomplete overlay */}
      <div className={styles.autocompleteOverlay}>
        <Autocomplete
          placeholder="Search for breweries... e.g: brew"
          fetchData={fetchBreweries}
          onSelect={handleBrewerySelect}
          debounceMs={300}
          minChars={2}
          maxResults={10}
          clearOnSelect={false}
        />

        {selectedBrewery && (
          <div className={styles.breweryCard}>
            <h3 className={styles.breweryTitle}>{selectedBrewery.label}</h3>
            <p className={styles.breweryDescription}>
              {selectedBrewery.description}
            </p>

            {selectedBrewery.location.address && (
              <p className={styles.breweryAddress}>
                📍 {selectedBrewery.location.address}
              </p>
            )}

            <div className={styles.contactLinks}>
              {selectedBrewery.contact.phone && (
                <a
                  href={`tel:${selectedBrewery.contact.phone}`}
                  className={styles.contactLink}
                >
                  📞 Call
                </a>
              )}
              {selectedBrewery.contact.website_url && (
                <a
                  href={selectedBrewery.contact.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Google Map */}
      <GoogleMap
        mapId="autocomplete-brewery-map"
        defaultCenter={{ lat: 37.5665, lng: 126.978 }} // Seoul, South Korea
        defaultZoom={10}
        gestureHandling="greedy"
        disableDefaultUI={true}
        className={styles.map}
      >
        {selectedBrewery?.location.latitude &&
          selectedBrewery.location.longitude && (
            <AdvancedMarker
              position={{
                lat: selectedBrewery.location.latitude,
                lng: selectedBrewery.location.longitude,
              }}
              anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
            >
              <div className={styles.markerContainer}>
                {/* Circular beer icon */}
                <div className={styles.beerIcon}>🍺</div>
                {/* Triangle pointing down */}
                <div className={styles.markerTriangle} />
              </div>
            </AdvancedMarker>
          )}
      </GoogleMap>
    </div>
  );
}
