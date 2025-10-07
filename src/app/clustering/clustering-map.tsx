"use client";

import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SuperCluster from "supercluster";
import { ClusterMarker } from "./cluster";
import { Marker } from "./marker";
import { BreweryPopup } from "./popup";

interface ClusterProperties {
  cluster: boolean;
  breweryId?: string;
  breweryName?: string;
  breweryType?: string;
  point_count?: number;
}

interface ClusterFeature {
  type: "Feature";
  properties: ClusterProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  id?: string;
}

interface Brewery {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  brewery_type: string;
  address_1: string;
  city: string;
  state: string;
  country: string;
}

const DEFAULT_CENTER = { lat: 53.32792203675942, lng: -8.101110663924798 };
const DEFAULT_ZOOM = 6.75968862915039;
const ZOOM_THRESHOLD = 10; // Stop clustering at zoom level 10 for individual brewery viewing
const CLUSTER_RADIUS = 85; // Clustering radius in pixels at zoom level 0 (scales with zoom)

export function ClusteringMap() {
  const map = useMap(); // Use the map instance directly in this component
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Popup state
  const [activePopup, setActivePopup] = useState<{
    brewery: Brewery;
    position: google.maps.LatLngLiteral;
    marker: RefObject<HTMLDivElement | null>;
  } | null>(null);

  // Map control state
  const markerRef = useRef<HTMLDivElement>(null);

  // Popup handlers
  const showPopup = useCallback(
    (brewery: Brewery, position: google.maps.LatLngLiteral) => {
      // get ref to marker
      // to add it to the click outside hook in popup
      markerRef.current = document.getElementById(
        `marker-${brewery.id}`,
      ) as HTMLDivElement;

      if (activePopup && activePopup.brewery.id === brewery.id) {
        setActivePopup(null);
      } else {
        setActivePopup({ brewery, position, marker: markerRef });
      }
    },
    [activePopup],
  );

  const hidePopup = useCallback(() => {
    setActivePopup(null);
  }, []);

  // Cluster click handler - zoom to cluster
  const handleClusterClick = useCallback(
    (position: google.maps.LatLngLiteral) => {
      if (!map) return;

      map.panTo(position);
      map.setZoom(Math.min((map.getZoom() || DEFAULT_ZOOM) + 2, 20));
    },
    [map],
  );

  // Initialize supercluster
  const supercluster = useMemo(() => {
    const cluster = new SuperCluster({
      radius: CLUSTER_RADIUS,
      maxZoom: ZOOM_THRESHOLD,
    });

    // Convert breweries to GeoJSON points
    const safeBreweries = Array.isArray(breweries) ? breweries : [];

    function hasDuplicateCoordinates(brewery: Brewery, arr: Brewery[]) {
      return arr.findIndex(
        (b) =>
          b.latitude === brewery.latitude &&
          b.longitude === brewery.longitude &&
          b.id !== brewery.id,
      );
    }

    const points: ClusterFeature[] = safeBreweries
      .filter((brewery) => brewery.latitude && brewery.longitude)
      .map((brewery, index) => {
        const hasDuplicate =
          hasDuplicateCoordinates(brewery, safeBreweries) < index;
        return {
          type: "Feature" as const,
          properties: {
            cluster: false,
            breweryId: brewery.id,
            breweryName: brewery.name,
            breweryType: brewery.brewery_type,
            hasDuplicate,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [
              hasDuplicate
                ? parseFloat(brewery.longitude) +
                  (0.00001 + Math.random() * 0.00001) *
                    (Math.random() < 0.5 ? -1 : 1)
                : parseFloat(brewery.longitude),
              hasDuplicate
                ? parseFloat(brewery.latitude) +
                  (0.00001 + Math.random() * 0.00001) *
                    (Math.random() < 0.5 ? -1 : 1)
                : parseFloat(brewery.latitude),
            ] as [number, number],
          },
        };
      });

    cluster.load(points);
    return cluster;
  }, [breweries]);

  // Get clusters for current zoom and bounds
  const clusters = useMemo(() => {
    if (!supercluster || !map) return [];

    const mapBounds = map.getBounds();
    if (!mapBounds) {
      console.warn("Map bounds are not available yet.");
      return [];
    }

    const mapBoundsObj = mapBounds.toJSON();
    const mapZoom = map.getZoom() || DEFAULT_ZOOM;
    const bounds = [
      mapBoundsObj.west,
      mapBoundsObj.south,
      mapBoundsObj.east,
      mapBoundsObj.north,
    ] as [number, number, number, number];

    return supercluster.getClusters(bounds, Math.round(mapZoom));
  }, [supercluster, map]);

  // Fetch breweries based on current map center
  const fetchBreweries = useCallback(async () => {
    try {
      if (!map) throw new Error("Map is not initialized");
      const latLng = map?.getCenter();
      const response = await fetch(
        `/api/brewery?lat=${latLng?.lat()}&lng=${latLng?.lng()}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch breweries");
      }
      const responseData = await response.json();
      const data: Brewery[] = responseData.data;
      setBreweries(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch breweries",
      );
      setBreweries([]);
    } finally {
      setLoading(false);
    }
  }, [map]);

  // Handle map camera changes
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCameraChanged = useCallback((event: MapCameraChangedEvent) => {
    const center = event.detail?.center;

    if (center) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setLoading(true);
      }, 300); // 300ms debounce
    }
  }, []);

  // Fetch breweries when loading is set to true
  // and map is available
  useEffect(() => {
    if (loading && map) {
      fetchBreweries();
    }
  }, [loading, fetchBreweries, map]);

  return (
    <>
      {/* Loading and error states */}
      {loading ? (
        <div>Loading...</div>
      ) : breweries && breweries.length === 0 ? (
        <div>No breweries found in this area.</div>
      ) : breweries && breweries.length > 0 ? (
        <div>
          Loaded {breweries.length} breweries. Clusters: {clusters.length}
        </div>
      ) : null}
      {error && <div style={{ color: "#ff7695" }}>Error: {error}</div>}

      <br />

      <GoogleMap
        mapId="clustering-map-raster"
        style={{ height: "600px" }}
        onCameraChanged={handleCameraChanged}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI={true}
        reuseMaps={true}
        renderingType={"RASTER"} // faster rendering for faster interaction
      >
        {clusters.map((cluster, _index: number) => {
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <ClusterMarker
                key={`cluster-${cluster.geometry.coordinates.join(",")}-${pointCount}`}
                count={pointCount || 0}
                position={{
                  lat: cluster.geometry.coordinates[1],
                  lng: cluster.geometry.coordinates[0],
                }}
                onClick={() =>
                  handleClusterClick({
                    lat: cluster.geometry.coordinates[1],
                    lng: cluster.geometry.coordinates[0],
                  })
                }
              />
            );
          }

          // Find the brewery data for this individual marker
          const brewery = Array.isArray(breweries)
            ? breweries.find((b) => b.id === cluster.properties.breweryId)
            : null;

          if (brewery) {
            return (
              <Marker
                key={`brewery-${brewery.id}`}
                brewery={brewery}
                position={{
                  lat: cluster.geometry.coordinates[1],
                  lng: cluster.geometry.coordinates[0],
                }}
                onClick={() =>
                  showPopup(brewery, {
                    lat: cluster.geometry.coordinates[1],
                    lng: cluster.geometry.coordinates[0],
                  })
                }
              />
            );
          }

          return null;
        })}

        {/* Global popup - only one can be shown at a time */}
        {activePopup && (
          <BreweryPopup
            brewery={activePopup.brewery}
            position={activePopup.position}
            marker={activePopup.marker}
            onClose={hidePopup}
          />
        )}
      </GoogleMap>
    </>
  );
}
