"use client";

import { useState } from "react";
import { SimpleMap } from "@/components/maps/simple";
import { blue } from "./blue";

const MapTypeId = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
} as const;

export type MapConfig = {
  id: string;
  useId: boolean;
  label: string;
  description: string;
  mapTypeId?: string;
  mapId?: string;
  colorScheme?: "LIGHT" | "DARK" | "FOLLOW_SYSTEM";
  styles?: google.maps.MapTypeStyle[];
  renderingType?: "RASTER" | "VECTOR";
};

const MAP_CONFIGS: MapConfig[] = [
  {
    id: "default",
    useId: false,
    label: "Default",
    description: "Standard Google Maps roadmap view",
    mapTypeId: MapTypeId.ROADMAP,
  },
  {
    id: "satellite",
    useId: false,
    label: "Satellite",
    description: "Satellite imagery view",
    mapTypeId: MapTypeId.SATELLITE,
  },
  {
    id: "hybrid",
    useId: false,
    label: "Hybrid",
    description: "Satellite imagery with road labels",
    mapTypeId: MapTypeId.HYBRID,
  },
  {
    id: "terrain",
    useId: false,
    label: "Terrain",
    description: "Physical terrain features",
    mapTypeId: MapTypeId.TERRAIN,
  },
  {
    id: "blue_theme",
    useId: false,
    label: "Blue Theme",
    description: "Custom style (raster)",
    mapTypeId: MapTypeId.ROADMAP,
    styles: blue,
    renderingType: "RASTER",
  },
  {
    id: "custom_monochrome_light",
    useId: true,
    label: "Monochrome Light",
    description: "Cloud Based",
    mapTypeId: MapTypeId.ROADMAP,
    mapId: "42a2a67291fa166a36624128",
    colorScheme: "LIGHT",
  },
  {
    id: "custom_monochrome_dark",
    useId: true,
    label: "Monochrome Dark",
    description: "Cloud Based",
    mapTypeId: MapTypeId.ROADMAP,
    mapId: "42a2a67291fa166a36624128",
    colorScheme: "DARK",
  },
];

export function Themes() {
  const [selectedConfig, setSelectedConfig] = useState<MapConfig>(
    MAP_CONFIGS[0],
  );

  return (
    <div>
      {/* Theme Selection */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <label
          htmlFor="theme-select"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Select Theme:
        </label>
        <select
          id="theme-select"
          value={selectedConfig.id}
          onChange={(e) => {
            const config = MAP_CONFIGS.find((c) => c.id === e.target.value);
            if (config) setSelectedConfig(config);
          }}
          style={{
            padding: "8px 12px",
            paddingRight: "30px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff",
            color: "#333",
            minWidth: "200px",
          }}
        >
          {MAP_CONFIGS.map((config) => (
            <option key={config.id} value={config.id}>
              {config.label} - {config.description}
            </option>
          ))}
        </select>
      </div>

      {/* Map Display */}
      <SimpleMap
        mapId={selectedConfig.useId ? selectedConfig.mapId : undefined}
        renderingType={selectedConfig.renderingType || undefined}
        mapTypeId={selectedConfig.mapTypeId || undefined}
        colorScheme={selectedConfig.colorScheme || undefined}
        styles={selectedConfig.styles || undefined}
        height="500px"
        defaultCenter={{ lat: -6.5, lng: 107.5 }}
        defaultZoom={8}
        gestureHandling="greedy"
        disableDefaultUI={true}
      />
    </div>
  );
}
