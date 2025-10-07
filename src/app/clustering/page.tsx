"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import TechnicalHighlights from "@/components/technical-highlights";
import { ClusteringMap } from "./map";

export default function ClusteringPage() {
  return (
    <>
      <h1>Brewery Clustering</h1>

      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <ClusteringMap />
      </APIProvider>

      <br />

      <TechnicalHighlights sections={technicalSections} />
    </>
  );
}

// Technical sections data
const technicalSections = [
  {
    emoji: "🎯",
    title: "SuperCluster",
    content: (
      <p>
        <a
          href="https://github.com/mapbox/supercluster"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>SuperCluster</strong>
        </a>{" "}
        is a high-performance JavaScript library for clustering geographic
        points on interactive maps. It uses a hierarchical algorithm to group
        nearby markers into clusters based on zoom level, with clustering
        disabled beyond zoom level 16 for individual brewery viewing.
      </p>
    ),
  },
  {
    emoji: "🍺",
    title: "Open Brewery DB",
    content: (
      <p>
        <a
          href="https://www.openbrewerydb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Open Brewery DB</strong>
        </a>{" "}
        is a free, community-maintained API providing comprehensive brewery data
        worldwide. This application uses geographic filtering to fetch breweries
        within map bounds for real-time local discovery.
      </p>
    ),
  },
  {
    emoji: "📄",
    title: "Source Code",
    content: (
      <p>
        <a
          href="https://github.com/juji/vis-gl/blob/main/src/app/clustering/page.tsx"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/juji/vis-gl/blob/main/src/app/clustering/page.tsx
        </a>
        .
      </p>
    ),
  },
];
