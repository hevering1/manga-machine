// src/app/api/references/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.base44.com/api/apps/69eb83a3def5ae18fa5c7c1a/functions/getReferences";

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BASE44_API_KEY || "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ references: [] }, { status: 200 });
  }
}
