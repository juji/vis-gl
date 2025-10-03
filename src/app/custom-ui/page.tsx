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
      <SimpleMap height="500px">
        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          <JoystickControl />
        </MapControl>
      </SimpleMap>
    `}</Code>
    </>
  );
}
