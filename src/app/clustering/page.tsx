"use client";

import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SuperCluster from "supercluster";
import CustomMarker from "@/components/custom-marker";
import { SimpleMap } from "@/components/maps/simple";
import styles from "./clustering.module.css";

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
  const DEFAULT_CENTER = { lat: 1.3521, lng: 103.8198 };

  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(10);
  const [mapBounds, setMapBounds] = useState<{
    east: number;
    north: number;
    south: number;
    west: number;
  } | null>(null);

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
        <p>
          Explore breweries with marker clustering. Zoom in to see individual
          locations.
        </p>
        {loading && <div className={styles.loading}>Loading breweries...</div>}
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
          defaultZoom={10}
        >
          {clusters.map((cluster, index: number) => {
            const { cluster: isCluster, point_count: pointCount } =
              cluster.properties;

            if (isCluster) {
              return (
                <CustomMarker
                  key={`cluster-${cluster.geometry.coordinates.join(",")}-${pointCount}`}
                  title={`${pointCount} breweries`}
                  size={20 + (pointCount || 0) * 2}
                  color="#ff6b6b"
                >
                  <div className={styles.clusterMarker}>{pointCount}</div>
                </CustomMarker>
              );
            }

            return (
              <CustomMarker
                key={`brewery-${cluster.properties.breweryId || `temp-${index}`}`}
                title={cluster.properties.breweryName || "Brewery"}
                size={32}
                color="#4ecdc4"
              >
                <div className={styles.breweryInfo}>
                  <strong>{cluster.properties.breweryName}</strong>
                  <br />
                  <small>{cluster.properties.breweryType}</small>
                </div>
              </CustomMarker>
            );
          })}
        </SimpleMap>
      </div>
    </div>
  );
}
