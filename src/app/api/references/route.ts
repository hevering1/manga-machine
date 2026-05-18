// src/app/api/references/route.ts
// Fetches reference library directly from Base44 entity API
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/ReferenceLibrary/`;

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(BASE44_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BASE44_API_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ references: [] });
    }

    const data = await res.json();
    const records = Array.isArray(data) ? data : (data.records || data.items || []);

    const references = records.map((r: any) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      genre: r.genre,
    }));

    return NextResponse.json({ references });
  } catch (e: any) {
    return NextResponse.json({ references: [] });
  }
}
