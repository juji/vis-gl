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
        <Link
          href="https://developers.google.com/maps/documentation/javascript/controls"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.google.com/maps/documentation/javascript/controls
        </Link>
      </p>
      <br />
      <Code lang="tsx" clean="      ">{`
      import { ControlPosition } from "@vis.gl/react-google-maps";

      //...

      <SimpleMap 
        fullscreenControl={true}
        fullscreenControlOptions={{
          position: ControlPosition.BOTTOM_RIGHT,
        }}
        height="500px" 
      />;
    `}</Code>
    </>
  );
}
