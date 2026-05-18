// src/app/api/library/route.ts
// Serves the full ReferenceLibrary from Base44 entity DB
import { NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/ReferenceLibrary`;

export async function GET() {
  try {
    const res = await fetch(BASE44_API, {
      headers: {
        "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ series: [] });
    }

    const data = await res.json();
    const records = Array.isArray(data) ? data : (data.records || data.items || []);
    return NextResponse.json({ series: records });
  } catch {
    return NextResponse.json({ series: [] });
  }
}
