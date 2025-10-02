import { Code } from "@/components/code";
import { SimpleMap } from "@/components/maps/simple";

export default function Home() {
  return (
    <>
      <h1>Simple Map Example</h1>
      <p>Just a simple 400px height map</p>
      <br />
      <SimpleMap height="400px" />
      <br />
      <Code
        lang="tsx"
        code={`
import { SimpleMap } from "@/components/maps/simple";

<SimpleMap height="500px" />
`}
      />
    </>
  );
}
