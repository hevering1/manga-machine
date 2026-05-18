// src/app/api/add-series/route.ts
// Researches a series and adds it to the ReferenceLibrary entity
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/ReferenceLibrary`;

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Series title is required" }, { status: 400 });
    }

    // Research the series via GPT-4o
    const prompt = `You are a manga/manhwa/manhua research expert. Research "${title}" and return a complete analysis as JSON.

Return ONLY this exact JSON structure, no markdown, no explanation:
{
  "title": "Official title",
  "type": "Manga | Manhwa | Manhua | Webtoon",
  "genre": ["genre1", "genre2"],
  "status": "Ongoing | Complete | Hiatus",
  "author": "Author name",
  "origin_country": "Japan | Korea | China | etc",
  "tone": "Brief tone description",
  "time_period_setting": "Modern | Medieval | Ancient | Futuristic | etc",
  "world_building": "2-3 sentence description of the world/setting",
  "power_system": "2-3 sentence description of how powers/abilities work",
  "protagonist_archetype": "Archetype label + 1 sentence description",
  "antagonist_archetype": "Archetype label + 1 sentence description",
  "side_character_strengths": "1-2 sentence description of notable side characters",
  "pacing_style": "Fast | Slow Burn | Explosive then slow | etc",
  "chapter_count": "Approximate number like '400+' or '179'",
  "what_made_it_great": "2-3 sentences on why it succeeded",
  "virality_factors": "Comma-separated list of key viral moments or hooks",
  "best_story_arcs": "Comma-separated list of best arcs",
  "weaknesses": "1-2 sentences on weaknesses or criticisms",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "research_status": "Complete"
}

If you don't recognize this series, do your best to research it accurately. Return ONLY valid JSON.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({ error: "AI research failed" }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let seriesData: any;
    try {
      seriesData = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) seriesData = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse research output" }, { status: 500 });
    }

    // Normalize arrays to JSON strings for storage
    const payload = {
      ...seriesData,
      genre: Array.isArray(seriesData.genre) ? seriesData.genre : [seriesData.genre],
      tags: Array.isArray(seriesData.tags) ? seriesData.tags : [seriesData.tags],
      research_status: "Complete",
    };

    // Save to Base44 entity
    const saveRes = await fetch(BASE44_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BASE44_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!saveRes.ok) {
      const err = await saveRes.text();
      return NextResponse.json({ error: "Save failed", details: err }, { status: 500 });
    }

    const saved = await saveRes.json();
    return NextResponse.json({ success: true, series: { ...payload, id: saved.id } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
