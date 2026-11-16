import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.UPSTREAM_API_BASE_URL || "https://predicting.top";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const upstreamUrl = `${BASE_URL}/api/${pathString}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: {
        revalidate: 60,
      },
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, {
      status: upstreamRes.status,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to proxy request";
    return NextResponse.json({ message }, { status: 500 });
  }
}

