import Link from "next/link";
import { Code } from "@/components/code";
import { CustomUiPlacement } from "./custom-ui-placement";

export default function CustomUiPlacementPage() {
  return (
    <>
      <h1>Custom UI Placement</h1>
      <CustomUiPlacement />
      <br />
      <p>
        Read all about it:{" "}
        <Link href="https://developers.google.com/maps/documentation/javascript/controls">
          https://developers.google.com/maps/documentation/javascript/controls
        </Link>
      </p>
      <p>
        Some controls may not be available on SimpleMap, that you have to add it
        to SimpleMap's definition.
      </p>
      <p>
        For this example, <code>fullscreenControl</code> and{" "}
        <code>fullscreenControlOptions</code> are already available.
      </p>
      <br />
      <Code lang="tsx" clean="      ">{`
      <SimpleMap 
        fullscreenControl={true}
        fullscreenControlOptions={{
          position: google.maps.ControlPosition.BOTTOM_RIGHT,
        }}
        height="500px" 
      />;
    `}</Code>
    </>
  );
}
