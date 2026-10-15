import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const cleanName = name.replace(/\.json$/, "");

  const filePath = path.join(process.cwd(), "public/r", `${cleanName}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: `Registry item "${name}" not found` }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content);

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
