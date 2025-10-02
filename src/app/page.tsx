import Link from "next/link";
import { Code } from "@/components/code";
import { SimpleMap } from "@/components/maps/simple";

export default function Home() {
  return (
    <>
      <h1>Simple Map Example</h1>
      <p>Just a simple 500px height map</p>
      <br />
      <SimpleMap height="500px" />
      <br />
      <Code
        lang="tsx"
        code={`
import { SimpleMap } from "@/components/maps/simple";

<SimpleMap height="500px" />
`}
      />
      <br />
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/juji/vis-gl/blob/main/src/components/maps/simple/index.tsx"
      >
        Code
      </Link>
    </>
  );
}
