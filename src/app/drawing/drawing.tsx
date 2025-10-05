"use client";

import {
  APIProvider
} from "@vis.gl/react-google-maps";
import { Map } from "./map";

export function Drawing() {

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map />
    </APIProvider>
  );
}
