import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("q");

    // Validate required parameter
    if (!query) {
      return NextResponse.json(
        { error: "Missing required parameter: query" },
        { status: 400 },
      );
    }

    // Validate query length
    if (query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters long" },
        { status: 400 },
      );
    }

    // Call the Open Brewery DB Autocomplete API
    const apiUrl = `https://api.openbrewerydb.org/v1/breweries/autocomplete?query=${encodeURIComponent(query)}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Vis-GL-App-jujiplay.com/1.0",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.error(
        `Brewery Search API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { error: "Failed to fetch brewery search results" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Transform the data to match our autocomplete component format
    const transformedData = data.map((brewery: any) => {
      // Build a descriptive label
      let description = "";

      // Add brewery type if available
      if (brewery.brewery_type) {
        const typeMap: Record<string, string> = {
          micro: "Microbrewery",
          brewpub: "Brewpub",
          large: "Large Brewery",
          regional: "Regional Brewery",
          contract: "Contract Brewery",
          proprietor: "Proprietor",
          closed: "Closed",
          planning: "Planning",
        };
        description = typeMap[brewery.brewery_type] || brewery.brewery_type;
      }

      // Add location if available
      const locationParts = [];
      if (brewery.city) locationParts.push(brewery.city);
      if (brewery.state || brewery.state_province)
        locationParts.push(brewery.state || brewery.state_province);

      if (locationParts.length > 0) {
        description += description
          ? ` • ${locationParts.join(", ")}`
          : locationParts.join(", ");
      }

      // Add address if available and no city/state
      if (!description && brewery.street) {
        description = brewery.street;
      }

      return {
        id:
          brewery.id ||
          `brewery-${brewery.name?.replace(/\s+/g, "-").toLowerCase()}`,
        label: brewery.name || "Unknown Brewery",
        value: brewery.name || "Unknown Brewery",
        description: description || "Brewery",
        brewery_type: brewery.brewery_type,
        location: {
          city: brewery.city,
          state: brewery.state || brewery.state_province,
          address: brewery.street,
          postal_code: brewery.postal_code,
          country: brewery.country,
          latitude: brewery.latitude,
          longitude: brewery.longitude,
        },
        contact: {
          phone: brewery.phone,
          website_url: brewery.website_url,
        },
        rawData: brewery, // Include original data for additional use
      };
    });

    // Return the transformed data
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Brewery Search API route error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
