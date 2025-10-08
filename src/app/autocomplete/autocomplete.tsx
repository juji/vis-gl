"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { AutocompleteMap } from "./autocomplete-map";

export function AutocompleteComponent() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <AutocompleteMap />
    </APIProvider>
  );
}
