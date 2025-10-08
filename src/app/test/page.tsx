"use client";

import { useState } from "react";
import Autocomplete, {
  type AutocompleteOption,
} from "@/components/autocomplete";

async function fetchSuggestions(query: string): Promise<AutocompleteOption[]> {
  const response = await fetch(
    `/api/brewery/search?query=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }
  return response.json();
}

export default function TestPage() {
  const [selectedItem, setSelectedItem] = useState<AutocompleteOption | null>(
    null,
  );
  const [selectedItems, setSelectedItems] = useState<AutocompleteOption[]>([]);

  const handleSelect = (option: AutocompleteOption) => {
    setSelectedItem(option);
    console.log("Selected:", option);
  };

  const handleMultiSelect = (option: AutocompleteOption) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === option.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, option];
    });
    console.log("Multi-selected:", option);
  };

  const removeSelectedItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#1e293b",
        }}
      >
        Autocomplete Component Test
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          color: "#64748b",
          marginBottom: "3rem",
          lineHeight: "1.6",
        }}
      >
        This page demonstrates the async autocomplete component with debounced
        search functionality. Try typing "stone", "ballast", "mission", or any
        other brewery name.
      </p>

      <div style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Basic Autocomplete
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Selected value stays in the input field
        </p>

        <Autocomplete
          placeholder="Search for breweries..."
          fetchData={fetchSuggestions}
          onSelect={handleSelect}
          debounceMs={300}
          minChars={2}
          maxResults={8}
        />

        {selectedItem && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#374151",
              }}
            >
              Selected Item:
            </h3>
            <p style={{ margin: "0", color: "#1e293b" }}>
              <strong>{selectedItem.label}</strong> - {selectedItem.description}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Multi-Select Autocomplete
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Input clears after selection for building a list
        </p>

        <Autocomplete
          placeholder="Add breweries to your list..."
          fetchData={fetchSuggestions}
          onSelect={handleMultiSelect}
          debounceMs={250}
          minChars={2}
          maxResults={10}
          clearOnSelect={true}
        />

        {selectedItems.length > 0 && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#374151",
              }}
            >
              Selected Breweries:
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {selectedItems.map((item) => (
                <span
                  key={item.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={() => removeSelectedItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "1rem",
                      padding: "0",
                      marginLeft: "0.25rem",
                    }}
                    title={`Remove ${item.label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Disabled State
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Shows how the component looks when disabled
        </p>

        <Autocomplete
          placeholder="This input is disabled..."
          fetchData={fetchSuggestions}
          disabled={true}
        />
      </div>

      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "#f1f5f9",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Features Demonstrated:
        </h3>
        <ul
          style={{
            margin: "0",
            paddingLeft: "1.5rem",
            color: "#4b5563",
            lineHeight: "1.6",
          }}
        >
          <li>✨ Async data fetching with realistic API delays</li>
          <li>⏱️ Debounced search (300ms delay)</li>
          <li>⌨️ Keyboard navigation (Arrow keys, Enter, Escape)</li>
          <li>🎯 Click to select options</li>
          <li>🔍 Minimum character requirement (2 chars)</li>
          <li>📱 Responsive design with mobile optimization</li>
          <li>♿ Accessibility features (ARIA attributes)</li>
          <li>🌙 Dark mode support</li>
          <li>💫 Loading states and error handling</li>
          <li>🚫 Disabled state styling</li>
        </ul>
      </div>
    </div>
  );
}
