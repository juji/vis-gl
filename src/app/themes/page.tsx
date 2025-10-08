import TechnicalHighlights from "@/components/technical-highlights";
import { Themes } from "./themes";

export default function ThemesPage() {
  const technicalSections = [
    {
      emoji: "🗺️",
      title: "Map Types & Styling",
      content: (
        <p>
          Demonstrates Google Maps built-in types (roadmap, satellite, hybrid,
          terrain) and custom styling approaches including local styles and
          cloud-based Map IDs for comprehensive theming options.
        </p>
      ),
    },
    {
      emoji: "🎨",
      title: "Custom Styling",
      content: (
        <p>
          Implements custom map styling using MapTypeStyle arrays to create
          unique appearances like dark themes by targeting specific map features
          and elements.
        </p>
      ),
    },
    {
      emoji: "☁️",
      title: "Cloud-Based Themes",
      content: (
        <p>
          Uses Google Maps Platform's cloud-based styling with Map IDs for
          professionally designed themes that can be managed through the Google
          Cloud Console.
        </p>
      ),
    },
    {
      emoji: "📄",
      title: "Source Code",
      content: (
        <>
          <p>
            <a
              href="https://github.com/juji/vis-gl/blob/main/src/app/themes/themes.tsx"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/juji/vis-gl/blob/main/src/app/themes/themes.tsx
            </a>
            .
          </p>
          <p>
            Based on the official{" "}
            <a
              href="https://github.com/visgl/react-google-maps/tree/main/examples/change-map-styles"
              target="_blank"
              rel="noopener noreferrer"
            >
              change-map-styles example
            </a>
            .
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <h1>Map Themes</h1>
      <br />
      <p>
        Explore different Google Maps styling approaches including built-in map
        types, cloud-based Map IDs, and custom local styles. Select a theme from
        the dropdown to see how it transforms the map appearance.
      </p>
      <br />

      <Themes />
      <br />

      <TechnicalHighlights sections={technicalSections} />
    </>
  );
}
