"use client";

import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { useCallback, useMemo, useRef, useState } from "react";
import SuperCluster from "supercluster";
import { SimpleMap } from "@/components/maps/simple";
import { ClusterMarker } from "./cluster";
import styles from "./clustering.module.css";
import { MapControl } from "./map-control";
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

export default function ClusteringPage() {
  // Default map center coordinates
  const DEFAULT_CENTER = { lat: 53.32792203675942, lng: -8.101110663924798 };
  const DEFAULT_ZOOM = 6.75968862915039;

  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [mapBounds, setMapBounds] = useState<{
    east: number;
    north: number;
    south: number;
    west: number;
  } | null>(null);

  // Popup state
  const [activePopup, setActivePopup] = useState<{
    brewery: Brewery;
    position: google.maps.LatLngLiteral;
  } | null>(null);

  // Map control state
  const [mapControlLat, setMapControlLat] = useState<number | null>(null);
  const [mapControlLng, setMapControlLng] = useState<number | null>(null);
  const [mapControlZoom, setMapControlZoom] = useState<number | null>(null);

  // Popup handlers
  const showPopup = useCallback(
    (brewery: Brewery, position: google.maps.LatLngLiteral) => {
      if (activePopup && activePopup.brewery.id === brewery.id) {
        setActivePopup(null);
      } else {
        setActivePopup({ brewery, position });
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
      setMapControlLat(position.lat);
      setMapControlLng(position.lng);
      setMapControlZoom(Math.min((mapZoom || DEFAULT_ZOOM) + 2, 20));
    },
    [mapZoom],
  );

  // Initialize supercluster
  const supercluster = useMemo(() => {
    const cluster = new SuperCluster({
      radius: 75,
      maxZoom: 20,
    });

    // Convert breweries to GeoJSON points
    const safeBreweries = Array.isArray(breweries) ? breweries : [];
    const points: ClusterFeature[] = safeBreweries
      .filter((brewery) => brewery.latitude && brewery.longitude)
      .map((brewery) => ({
        type: "Feature" as const,
        properties: {
          cluster: false,
          breweryId: brewery.id,
          breweryName: brewery.name,
          breweryType: brewery.brewery_type,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [
            parseFloat(brewery.longitude),
            parseFloat(brewery.latitude),
          ] as [number, number],
        },
      }));

    cluster.load(points);
    return cluster;
  }, [breweries]);

  // Get clusters for current zoom and bounds
  const clusters = useMemo(() => {
    if (!mapBounds || !supercluster) return [];

    const bounds = [
      mapBounds.west,
      mapBounds.south,
      mapBounds.east,
      mapBounds.north,
    ] as [number, number, number, number];

    return supercluster.getClusters(bounds, Math.round(mapZoom));
  }, [supercluster, mapBounds, mapZoom]);

  // Fetch breweries based on current map center
  const fetchBreweries = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/brewery?lat=${lat}&lng=${lng}`);
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
  }, []);

  // Handle map camera changes
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCameraChanged = useCallback(
    (event: MapCameraChangedEvent) => {
      const center = event.detail?.center;
      const zoom = event.detail?.zoom;
      const bounds = event.detail?.bounds;

      // console.log('center changed', center, zoom, bounds);

      if (center) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          fetchBreweries(center.lat, center.lng);
        }, 300); // 300ms debounce
      }
      if (zoom) {
        setMapZoom(zoom);
      }
      if (bounds) {
        setMapBounds(bounds);
      }
    },
    [fetchBreweries],
  );

  // Initial load
  // no need handleCameraChanged will do this
  // useEffect(() => {
  //   // fetchBreweries(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
  // }, [fetchBreweries]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Brewery Clustering</h1>
        {loading ? (
          <p>Loading breweries...</p>
        ) : (
          <p>
            Explore breweries with marker clustering. Zoom in to see individual
            locations.
          </p>
        )}
        {error && <div className={styles.error}>Error: {error}</div>}
        <div className={styles.stats}>
          <span>
            Total Breweries: {Array.isArray(breweries) ? breweries.length : 0}
          </span>
          <span>Clusters: {clusters.length}</span>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <SimpleMap
          mapId="clustering-map"
          height="600px"
          onCameraChanged={handleCameraChanged}
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
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
              onClose={hidePopup}
            />
          )}

          {/* Map control for programmatic camera changes */}
          <MapControl
            lat={mapControlLat}
            lng={mapControlLng}
            zoom={mapControlZoom}
          />
        </SimpleMap>
      </div>
    </div>
  );
}
