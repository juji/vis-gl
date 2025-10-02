import { Code } from "@/components/code";
import { UiMap } from "./ui-map";

export default function MarkerPage() {
  return (
    <>
      <h1>Default UI</h1>
      <UiMap />
      <br />
      <Code lang="tsx">{`
      <SimpleMap disableDefaultUI={false} height="500px" />
    `}</Code>
    </>
  );
}
