import { Code } from "@/components/code";
import { DefaultUiMap } from "./default-ui-map";

export default function DefaultUiPage() {
  return (
    <>
      <h1>Default UI</h1>
      <DefaultUiMap />
      <br />
      <Code lang="tsx">{`
      <SimpleMap disableDefaultUI={false} height="500px" />
    `}</Code>
    </>
  );
}
