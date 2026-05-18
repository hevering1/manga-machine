// src/app/api/story-engine/route.ts
// Calls OpenAI directly from the Next.js backend — no proxy needed
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/ReferenceLibrary/`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tone, genre, themes, powerSystemStyle, protagonistType, worldScale, referenceIds } = body;

    // Fetch reference library
    let references: any[] = [];
    try {
      const res = await fetch(BASE44_API, {
        headers: {
          "Authorization": `Bearer ${process.env.BASE44_API_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const records = Array.isArray(data) ? data : (data.records || data.items || []);
        if (referenceIds && referenceIds.length > 0) {
          references = records.filter((r: any) => referenceIds.includes(r.id));
        } else {
          references = records;
        }
      }
    } catch {}

    // Build context
    const refContext = references.map((r: any) =>
      `- ${r.title}: Power System: ${r.power_system} | World: ${r.world_building} | Protagonist: ${r.protagonist_archetype} | What Made It Great: ${r.what_made_it_great} | Virality: ${r.virality_factors}`
    ).join("\n");

    const prompt = `You are an elite manga/manhwa story architect. Using the reference series below as inspiration (NOT copying — synthesizing the best elements into something wholly original), generate a complete original series concept.

REFERENCE LIBRARY (use as inspiration only):
${refContext || "No specific references — draw on your knowledge of top manga/manhwa."}

USER INPUTS:
- Tone: ${tone || "Dark Epic"}
- Genre: ${genre || "Action Fantasy"}
- Themes: ${themes || "Revenge, Power, Identity"}
- Power System Style: ${powerSystemStyle || "Unique skill-based with evolution"}
- Protagonist Type: ${protagonistType || "Hidden Genius / Underdog"}
- World Scale: ${worldScale || "Epic multi-nation"}

Generate the following in this exact JSON structure. Be creative, detailed, and wholly original:

{
  "series_title": "string",
  "tagline": "string",
  "elevator_pitch": "string",
  "world_name": "string",
  "world_building": "string",
  "power_system_name": "string",
  "power_system": "string",
  "protagonist_name": "string",
  "protagonist_background": "string",
  "protagonist_archetype": "string",
  "antagonist_name": "string",
  "antagonist_motivation": "string",
  "antagonist_archetype": "string",
  "supporting_cast": [
    {"name": "string", "role": "string", "description": "string"},
    {"name": "string", "role": "string", "description": "string"},
    {"name": "string", "role": "string", "description": "string"}
  ],
  "core_themes": ["string", "string", "string"],
  "tone": "string",
  "virality_hooks": ["string", "string", "string", "string", "string"],
  "chapter_arc_structure": [
    {"arc_name": "string", "chapters": "string", "summary": "string"},
    {"arc_name": "string", "chapters": "string", "summary": "string"},
    {"arc_name": "string", "chapters": "string", "summary": "string"},
    {"arc_name": "string", "chapters": "string", "summary": "string"}
  ],
  "first_10_chapters": [
    {"chapter": 1, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 2, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 3, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 4, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 5, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 6, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 7, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 8, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 9, "title": "string", "summary": "string", "hook": "string"},
    {"chapter": 10, "title": "string", "summary": "string", "hook": "string"}
  ],
  "what_makes_it_original": "string",
  "target_audience": "string",
  "comparable_series": ["string", "string", "string"]
}

Return ONLY valid JSON. No markdown fences, no explanation.`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.text();
      return NextResponse.json({ error: "AI generation failed", details: err }, { status: 500 });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices[0].message.content;

    let story: any;
    try {
      story = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        story = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json({ error: "Failed to parse story output" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, story });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
