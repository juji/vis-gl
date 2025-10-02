import Link from "next/link";
import { Code } from "@/components/code";
import { SimpleMap } from "@/components/maps/simple";

export default function Home() {
  return (
    <>
      <h1>Simple Map Example</h1>
      <p>Just a simple 500px height map</p>
      <br />
      <SimpleMap
        height="500px"
        // tangerang, banten, indonesia
        defaultCenter={{ lat: -6.178306, lng: 106.631889 }}
      />
      <br />
      <Code lang="tsx" clean="        ">{`
        import { SimpleMap } from "@/components/maps/simple";

        <SimpleMap 
          height="500px" 
          defaultCenter={{ lat: -6.178306, lng: 106.631889 }} 
        />
      `}</Code>
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
