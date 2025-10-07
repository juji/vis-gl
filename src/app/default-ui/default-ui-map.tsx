"use client";

import { SimpleMap } from "@/components/maps/simple";

export function DefaultUiMap() {
  return (
    <SimpleMap
      mapId={"default-ui-map"}
      disableDefaultUI={false}
      height="500px"
    />
  );
}
