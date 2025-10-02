import { Code } from "@/components/code";
import { Changes } from "./changes";

export default function TrackingChanges() {
  return (
    <>
      <h1>Tracking Changes</h1>
      <p>Track changes in the map, like center, zoom, bounds, etc.</p>
      <br />
      <Changes />
      <br />
      <Code lang="tsx" clean="      ">{`
      <SimpleMap
        onCenterChanged={onCenterChanged}
        onZoomChanged={onZoomChanged}
        onBoundsChanged={onBoundsChanged}
      />
    `}</Code>
    </>
  );
}
