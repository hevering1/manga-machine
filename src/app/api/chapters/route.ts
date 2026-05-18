// src/app/api/chapters/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const API = `https://app.base44.com/api/apps/${APP_ID}/entities/ChapterScript`;
const HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`,
};

export async function GET() {
  try {
    const res = await fetch(API, { headers: HEADERS, cache: "no-store" });
    if (!res.ok) return NextResponse.json({ chapters: [] });
    const data = await res.json();
    const records = Array.isArray(data) ? data : (data.records || data.items || []);
    return NextResponse.json({ chapters: records });
  } catch { return NextResponse.json({ chapters: [] }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const res = await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(updates),
    });
    if (!res.ok) return NextResponse.json({ error: "Update failed" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
