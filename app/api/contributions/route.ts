import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username") || "ThaminduDasanayake";

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      {
        next: { revalidate: 86400 }, // Cache on server for 24 hours
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch contributions for ${username}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error fetching contributions", details: String(error) },
      { status: 500 }
    );
  }
}
