import Link from "next/link";
import { Code } from "@/components/code";
import { CustomUi } from "./custom-ui";

export default function CustomUiPage() {
  return (
    <>
      <h1>Custom UI</h1>
      <CustomUi />
      <br />
      <p>
        Read all about it:{" "}
        <Link href="https://developers.google.com/maps/documentation/javascript/controls">
          https://developers.google.com/maps/documentation/javascript/controls
        </Link>
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
