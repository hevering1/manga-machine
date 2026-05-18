// src/app/api/save-bible/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/SeriesBible`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept both { bible } (from StoryEngine) and { story } (legacy)
    const s = body.bible || body.story;
    const config = body.config || {};

    if (!s || !s.series_title) {
      return NextResponse.json({ error: "No bible data provided" }, { status: 400 });
    }

    const payload = {
      series_title: s.series_title || "",
      tagline: s.tagline || "",
      elevator_pitch: s.elevator_pitch || "",
      world_name: s.world_name || "",
      world_building: s.world_building || "",
      power_system_name: s.power_system_name || "",
      power_system: s.power_system || "",
      protagonist_name: s.protagonist_name || "",
      protagonist_background: s.protagonist_background || "",
      protagonist_archetype: s.protagonist_archetype || "",
      antagonist_name: s.antagonist_name || "",
      antagonist_motivation: s.antagonist_motivation || "",
      antagonist_archetype: s.antagonist_archetype || "",
      supporting_cast: typeof s.supporting_cast === "string"
        ? s.supporting_cast
        : JSON.stringify(s.supporting_cast || []),
      core_themes: typeof s.core_themes === "string"
        ? s.core_themes
        : JSON.stringify(s.core_themes || []),
      tone: s.tone || "",
      virality_hooks: typeof s.virality_hooks === "string"
        ? s.virality_hooks
        : JSON.stringify(s.virality_hooks || []),
      chapter_arc_structure: typeof s.chapter_arc_structure === "string"
        ? s.chapter_arc_structure
        : JSON.stringify(s.chapter_arc_structure || []),
      first_10_chapters: typeof s.first_10_chapters === "string"
        ? s.first_10_chapters
        : JSON.stringify(s.first_10_chapters || []),
      what_makes_it_original: s.what_makes_it_original || "",
      target_audience: s.target_audience || "",
      comparable_series: typeof s.comparable_series === "string"
        ? s.comparable_series
        : JSON.stringify(s.comparable_series || []),
      status: "Draft",
      generation_config: JSON.stringify(config),
    };

    const res = await fetch(BASE44_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Save failed:", err);
      return NextResponse.json({ error: "Save failed", details: err }, { status: 500 });
    }

    const saved = await res.json();
    return NextResponse.json({ success: true, id: saved.id });
  } catch (e: any) {
    console.error("save-bible error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
