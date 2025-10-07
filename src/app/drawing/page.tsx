// import { Code } from "@/components/code";
import TechnicalHighlights from "@/components/technical-highlights";
import { Drawing } from "./drawing";

export default function DrawingPage() {
  const technicalSections = [
    {
      emoji: "🎨",
      title: "Interactive Drawing",
      content: (
        <p>
          Built with{" "}
          <a
            href="https://visgl.github.io/react-google-maps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>@vis.gl/react-google-maps</strong>
          </a>{" "}
          and Google Maps API. Features real-time drawing of polygons, lines,
          circles, and rectangles with full editing capabilities including drag,
          resize, and vertex manipulation.
        </p>
      ),
    },
    {
      emoji: "🔄",
      title: "Undo/Redo System",
      content: (
        <p>
          Implements a custom history management system with proper state
          tracking and memory leak prevention. All drawing operations are
          reversible with comprehensive event listener cleanup to ensure optimal
          performance.
        </p>
      ),
    },
    {
      emoji: "📄",
      title: "Source Code",
      content: (
        <p>
          <a
            href="https://github.com/juji/vis-gl/blob/main/src/app/drawing/page.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/juji/vis-gl/blob/main/src/app/drawing/page.tsx
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <>
      <h1>Drawing</h1>
      <br />
      <p>Click the icon on the right, and start drawing.</p>
      <Drawing />
      <br />

      <TechnicalHighlights sections={technicalSections} />
    </>
  );
}
