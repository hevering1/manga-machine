// src/app/api/characters/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BIBLES_API = `https://app.base44.com/api/apps/${APP_ID}/entities/SeriesBible`;

async function generatePortrait(char: any): Promise<string> {
  const prompt = `High-converting manga/manhwa character portrait of ${char.name}, ${char.role}. ${char.archetype || ""}. ${char.background ? char.background.slice(0, 100) : ""}. Dramatic close-up face portrait, intense expression, cinematic manga art style, detailed linework, dark atmospheric background with subtle power effects. Vertical portrait format, professional manga character design sheet, 2:3 ratio.`;

  const res = await fetch("https://api.openai.com/v1/images/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",
      quality: "hd",
      style: "vivid",
    }),
  });

  if (!res.ok) return "";
  const data = await res.json();
  return data.data?.[0]?.url || "";
}

// GET /api/characters?bibleId=xxx — get characters for a bible
export async function GET(req: NextRequest) {
  const bibleId = req.nextUrl.searchParams.get("bibleId");
  if (!bibleId) return NextResponse.json({ characters: [] });

  try {
    const res = await fetch(`${BIBLES_API}/${bibleId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return NextResponse.json({ characters: [] });
    const bible = await res.json();

    const chars = [];
    if (bible.protagonist_name) {
      chars.push({
        name: bible.protagonist_name,
        role: "Protagonist",
        archetype: bible.protagonist_archetype,
        background: bible.protagonist_background,
        motivation: "Achieve growth and overcome obstacles",
        power: bible.power_system_name,
        weakness: "",
        relationship: `Opposed by ${bible.antagonist_name}`,
        series: bible.series_title,
      });
    }
    if (bible.antagonist_name) {
      chars.push({
        name: bible.antagonist_name,
        role: "Antagonist",
        archetype: bible.antagonist_archetype,
        background: bible.antagonist_motivation,
        motivation: bible.antagonist_motivation,
        power: "",
        weakness: "",
        relationship: `Opposes ${bible.protagonist_name}`,
        series: bible.series_title,
      });
    }
    try {
      const supporting = JSON.parse(bible.supporting_cast || "[]");
      for (const s of supporting) {
        chars.push({ name: s.name, role: s.role, archetype: "", background: s.description, motivation: "", power: "", weakness: "", relationship: "", series: bible.series_title });
      }
    } catch {}
    return NextResponse.json({ characters: chars });
  } catch {
    return NextResponse.json({ characters: [] });
  }
}

// POST /api/characters — generate new characters from context
export async function POST(req: NextRequest) {
  try {
    const { seriesContext, bibleId, count = 3, includePortraits = true } = await req.json();

    let context = seriesContext;

    if (bibleId) {
      const res = await fetch(`${BIBLES_API}/${bibleId}`, {
        headers: { "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const bible = await res.json();
        context = `Series: ${bible.series_title}. ${bible.elevator_pitch}. World: ${bible.world_building}. Power System: ${bible.power_system_name} — ${bible.power_system}. Protagonist: ${bible.protagonist_name} (${bible.protagonist_archetype}). Antagonist: ${bible.antagonist_name}. Tone: ${bible.tone}.`;
      }
    }

    const prompt = `You are an elite manga character designer. Generate ${count} compelling, original characters for this series.

Series Context:
${context}

Return ONLY a JSON array of ${count} character objects:
[
  {
    "name": "Character full name",
    "role": "Protagonist | Antagonist | Mentor | Rival | Support | Wildcard",
    "archetype": "Brief archetype label",
    "background": "2-3 sentence backstory with specific details",
    "motivation": "Core motivation that drives all their actions",
    "power": "Their specific ability or power description",
    "weakness": "A genuine weakness or vulnerability",
    "relationship": "How they relate to the protagonist or main cast"
  }
]

Make each character feel distinct, memorable, and dramatically useful. Give them specific names that fit the world's tone. Return ONLY valid JSON array.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "Character generation failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let characters: any[];
    try {
      characters = JSON.parse(raw);
    } catch {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) characters = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse character data" }, { status: 500 });
    }

    // Generate portraits in parallel if requested
    if (includePortraits) {
      const portraitPromises = characters.map(c => generatePortrait(c).catch(() => ""));
      const portraits = await Promise.all(portraitPromises);
      characters = characters.map((c, i) => ({ ...c, portrait: portraits[i] }));
    }

    return NextResponse.json({ success: true, characters });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/characters — regenerate portrait for existing character
export async function PUT(req: NextRequest) {
  try {
    const { character } = await req.json();
    const portrait = await generatePortrait(character);
    return NextResponse.json({ success: true, portrait });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
