import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    // Validate required parameters
    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Missing required parameters: lat and lng" },
        { status: 400 },
      );
    }

    // Validate that lat and lng are valid numbers
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return NextResponse.json(
        { error: "Invalid lat/lng values. Must be valid numbers." },
        { status: 400 },
      );
    }

    // Validate lat/lng ranges
    if (latNum < -90 || latNum > 90) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 },
      );
    }

    if (lngNum < -180 || lngNum > 180) {
      return NextResponse.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 },
      );
    }

    // Call the Open Brewery DB API
    const apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${latNum},${lngNum}&per_page=200`;

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
        `Brewery API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { error: "Failed to fetch brewery data" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Return the data with additional metadata
    return NextResponse.json({
      data,
      meta: {
        count: data.length,
        lat: latNum,
        lng: lngNum,
        source: "Open Brewery DB",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Brewery API route error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
