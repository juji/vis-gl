import TechnicalHighlights from "@/components/technical-highlights";
import { AutocompleteComponent } from "./autocomplete";

export default function AutocompletePage() {
  const technicalSections = [
    {
      emoji: "🔍",
      title: "Async Search",
      content: (
        <>
          <p>
            Real-time brewery search using OpenBreweryDB API with debounced
            input (300ms) for optimal performance.
          </p>
          <ul>
            <li>Minimum 2 characters to start searching</li>
            <li>Loading states and error handling</li>
            <li>Structured response transformation</li>
          </ul>
        </>
      ),
    },
    {
      emoji: "🗺️",
      title: "Map Integration",
      content: (
        <>
          <p>
            Google Maps integration with programmatic control to prevent map
            locking during user interaction.
          </p>
          <ul>
            <li>useMap() hook for direct map control</li>
            <li>Smooth transitions to brewery locations</li>
            <li>Custom anchor points for stable positioning</li>
          </ul>
        </>
      ),
    },
    {
      emoji: "📍",
      title: "Custom Markers",
      content: (
        <>
          <p>
            Custom brewery markers with beer emoji and triangle pointer for
            precise location indication.
          </p>
          <ul>
            <li>Green circular design with white borders</li>
            <li>White triangle pointing to exact coordinates</li>
            <li>Drop shadows for visual depth</li>
          </ul>
        </>
      ),
    },
    {
      emoji: "🏢",
      title: "Rich Data",
      content: (
        <>
          <p>
            Comprehensive brewery information including type, location, and
            contact details.
          </p>
          <ul>
            <li>Brewery type mapping (micro, brewpub, regional)</li>
            <li>Full address and geographic coordinates</li>
            <li>Phone numbers and website links</li>
          </ul>
        </>
      ),
    },
    {
      emoji: "⌨️",
      title: "Keyboard Navigation",
      content: (
        <>
          <p>
            Full keyboard accessibility with arrow keys, enter, and escape
            support for autocomplete navigation.
          </p>
          <ul>
            <li>Arrow keys for option navigation</li>
            <li>Enter to select highlighted option</li>
            <li>Escape to close suggestions</li>
          </ul>
        </>
      ),
    },
    {
      emoji: "🎨",
      title: "Responsive Design",
      content: (
        <>
          <p>
            Mobile-optimized interface with dark mode support and accessibility
            features.
          </p>
          <ul>
            <li>ARIA attributes for screen readers</li>
            <li>Mobile-friendly touch interactions</li>
            <li>High contrast mode support</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: "2rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            🍺 Brewery Finder
          </h1>
          <p>
            Discover breweries around the world with our interactive map. Search
            by name to find detailed information about microbreweries, brewpubs,
            and regional breweries. Each result shows location, contact details,
            and maps directly to the brewery's coordinates.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ flex: 1 }}>
        <AutocompleteComponent />
      </div>

      {/* Technical Highlights Section */}
      <TechnicalHighlights sections={technicalSections} />
    </div>
  );
}
