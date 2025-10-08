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
    <div style={{ position: "relative" }}>
      {/* Autocomplete overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          zIndex: 1000,
          maxWidth: "400px",
        }}
      >
        <Autocomplete
          placeholder="Search for breweries..."
          fetchData={fetchBreweries}
          onSelect={handleBrewerySelect}
          debounceMs={300}
          minChars={2}
          maxResults={10}
          clearOnSelect={false}
        />

        {selectedBrewery && (
          <div
            style={{
              marginTop: "12px",
              padding: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              {selectedBrewery.label}
            </h3>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              {selectedBrewery.description}
            </p>

            {selectedBrewery.location.address && (
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "0.875rem",
                  color: "#4b5563",
                }}
              >
                📍 {selectedBrewery.location.address}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {selectedBrewery.contact.phone && (
                <a
                  href={`tel:${selectedBrewery.contact.phone}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "#3b82f6",
                    textDecoration: "none",
                  }}
                >
                  📞 Call
                </a>
              )}
              {selectedBrewery.contact.website_url && (
                <a
                  href={selectedBrewery.contact.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.875rem",
                    color: "#3b82f6",
                    textDecoration: "none",
                  }}
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
        style={{ width: "100%", height: "600px" }}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Circular beer icon */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#72dc26",
                    borderRadius: "50%",
                    border: "3px solid #ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    padding: "21px",
                  }}
                >
                  🍺
                </div>
                {/* Triangle pointing down */}
                <div
                  style={{
                    width: "0",
                    height: "0",
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "12px solid #ffffff",
                    marginTop: "-3px",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                  }}
                />
              </div>
            </AdvancedMarker>
          )}
      </GoogleMap>
    </div>
  );
}
