// src/app/api/save-bible/route.ts
// Saves a generated story bible to Base44 SeriesBible entity
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/SeriesBible`;

export async function POST(req: NextRequest) {
  try {
    const { story, config } = await req.json();

    const payload = {
      series_title: story.series_title,
      tagline: story.tagline,
      elevator_pitch: story.elevator_pitch,
      world_name: story.world_name,
      world_building: story.world_building,
      power_system_name: story.power_system_name,
      power_system: story.power_system,
      protagonist_name: story.protagonist_name,
      protagonist_background: story.protagonist_background,
      protagonist_archetype: story.protagonist_archetype,
      antagonist_name: story.antagonist_name,
      antagonist_motivation: story.antagonist_motivation,
      antagonist_archetype: story.antagonist_archetype,
      supporting_cast: JSON.stringify(story.supporting_cast),
      core_themes: JSON.stringify(story.core_themes),
      tone: story.tone,
      virality_hooks: JSON.stringify(story.virality_hooks),
      chapter_arc_structure: JSON.stringify(story.chapter_arc_structure),
      first_10_chapters: JSON.stringify(story.first_10_chapters),
      what_makes_it_original: story.what_makes_it_original,
      target_audience: story.target_audience,
      comparable_series: JSON.stringify(story.comparable_series),
      status: "Draft",
      generation_config: JSON.stringify(config || {}),
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
      return NextResponse.json({ error: "Save failed", details: err }, { status: 500 });
    }

    const saved = await res.json();
    return NextResponse.json({ success: true, id: saved.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
