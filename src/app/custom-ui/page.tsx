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
        <Link
          href="https://visgl.github.io/react-google-maps/docs/api-reference/components/map-control"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://visgl.github.io/react-google-maps/docs/api-reference/components/map-control
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
