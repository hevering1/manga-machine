// src/app/api/world-builder/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BIBLES_API = `https://app.base44.com/api/apps/${APP_ID}/entities/SeriesBible`;

export async function POST(req: NextRequest) {
  try {
    const { bibleId, customContext, includeMap = true } = await req.json();

    let context = customContext;
    let seriesTitle = "";

    if (bibleId) {
      const res = await fetch(`${BIBLES_API}/${bibleId}`, {
        headers: { "Authorization": `Bearer ${process.env.BASE44_API_KEY}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const bible = await res.json();
        seriesTitle = bible.series_title;
        context = `Series: ${bible.series_title}. World: ${bible.world_name}. ${bible.world_building}. Power System: ${bible.power_system_name} — ${bible.power_system}. Tone: ${bible.tone}. Protagonist: ${bible.protagonist_name} — ${bible.protagonist_background}. Core themes: ${JSON.stringify(bible.core_themes)}.`;
      }
    }

    const prompt = `You are an elite manga world-building expert. Build a comprehensive world bible for this series concept.

Context:
${context}

Return ONLY a JSON object:
{
  "world_name": "The world's name",
  "world_concept": "2-3 sentence overview of what makes this world unique and compelling",
  "geography": [
    "Region/location name — brief description of significance",
    "Region/location name — brief description",
    "Region/location name — brief description",
    "Region/location name — brief description",
    "Region/location name — brief description"
  ],
  "factions": [
    {"name": "Faction name", "ideology": "Core belief/mission", "power": "Military/political/magical power level"},
    {"name": "Faction name", "ideology": "Core belief/mission", "power": "Military/political/magical power level"},
    {"name": "Faction name", "ideology": "Core belief/mission", "power": "Military/political/magical power level"},
    {"name": "Faction name", "ideology": "Core belief/mission", "power": "Military/political/magical power level"}
  ],
  "lore": "The ancient foundational lore — origin myths, creation events, first civilizations",
  "rules": [
    "World rule 1 — a fundamental law that governs how this world works",
    "World rule 2",
    "World rule 3",
    "World rule 4",
    "World rule 5"
  ],
  "history": "2-3 sentences on the world's pivotal historical events that led to the current state",
  "mysteries": [
    "An unsolved mystery that could drive storylines",
    "A mystery about the world's past",
    "A mystery about a person or faction",
    "A mystery about the power system"
  ],
  "threats": [
    "The primary world-level threat",
    "A secondary political threat",
    "A lurking ancient threat"
  ],
  "map_prompt": "A detailed map art prompt for this world — describe the geography, key regions, landmasses, seas, and notable landmarks visible on the map. Cinematic fantasy map style, top-down view, detailed cartography. End with: Fantasy map art style, parchment or dark background, detailed geographic illustration."
}

Return ONLY valid JSON.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2500,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "World generation failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();
    let worldData: any;
    try { worldData = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); if (m) worldData = JSON.parse(m[0]); else return NextResponse.json({ error: "Parse failed" }, { status: 500 }); }

    // Generate map
    let mapImage = "";
    if (includeMap && worldData.map_prompt) {
      try {
        const mapRes = await fetch("https://api.openai.com/v1/images/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: worldData.map_prompt,
            n: 1,
            size: "1792x1024",
            quality: "hd",
            style: "vivid",
          }),
        });
        if (mapRes.ok) {
          const mapData = await mapRes.json();
          mapImage = mapData.data?.[0]?.url || "";
        }
      } catch {}
    }

    delete worldData.map_prompt;
    return NextResponse.json({ success: true, world: { ...worldData, map_image: mapImage } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
