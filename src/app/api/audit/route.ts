// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BIBLES_API = `https://app.base44.com/api/apps/${APP_ID}/entities/SeriesBible`;

export async function POST(req: NextRequest) {
  try {
    const { content, mode } = await req.json();

    let auditContent = content;

    // If mode is "select", fetch the bible from DB
    if (mode === "select" && content) {
      const res = await fetch(`${BIBLES_API}/${content}`, {
        headers: {
          "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (res.ok) {
        const bible = await res.json();
        auditContent = `Series: ${bible.series_title}
Tagline: ${bible.tagline}
Elevator Pitch: ${bible.elevator_pitch}
World: ${bible.world_name} — ${bible.world_building}
Power System: ${bible.power_system_name} — ${bible.power_system}
Protagonist: ${bible.protagonist_name} (${bible.protagonist_archetype}) — ${bible.protagonist_background}
Antagonist: ${bible.antagonist_name} (${bible.antagonist_archetype}) — ${bible.antagonist_motivation}
Tone: ${bible.tone}
Core Themes: ${JSON.stringify(bible.core_themes)}
Virality Hooks: ${JSON.stringify(bible.virality_hooks)}
Arc Structure: ${JSON.stringify(bible.chapter_arc_structure)}
First 10 Chapters: ${JSON.stringify(bible.first_10_chapters)}
What Makes It Original: ${bible.what_makes_it_original}
Target Audience: ${bible.target_audience}
Comparable Series: ${JSON.stringify(bible.comparable_series)}`;
      }
    }

    const prompt = `You are an elite manga/manhwa industry analyst and story auditor. Analyze the following series concept and provide a comprehensive audit.

SERIES CONTENT:
${auditContent}

Return ONLY a JSON object with this exact structure:
{
  "overall_score": <integer 1-100>,
  "virality_score": <integer 1-100>,
  "hook_strength": <integer 1-100>,
  "pacing_score": <integer 1-100>,
  "originality_score": <integer 1-100>,
  "emotional_resonance": <integer 1-100>,
  "market_fit": <integer 1-100>,
  "verdict": "<2-3 sentence overall assessment with honest critique>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "chapter_1_critique": "<Specific critique of chapter 1's hook, pacing, and reader retention>",
  "chapter_2_critique": "<Specific critique of chapter 2's momentum and escalation>",
  "chapter_3_critique": "<Specific critique of chapter 3's hook and whether it delivers on the promise of ch1>",
  "tiktok_potential": "<2 sentences on how well this series will perform on TikTok edits, reaction videos, power-scaling content>",
  "reddit_potential": "<2 sentences on Reddit virality — theory crafting, debate potential, community engagement>",
  "first_page_hook": "<Specific advice on what the very first page should contain to maximize reader retention>",
  "recommended_fixes": ["<fix 1>", "<fix 2>", "<fix 3>", "<fix 4>", "<fix 5>"],
  "comparable_hits": ["<comparable series 1>", "<comparable series 2>", "<comparable series 3>"],
  "series_dna": [
    {"series": "<series name>", "influence": <integer 5-50>},
    {"series": "<series name>", "influence": <integer 5-50>},
    {"series": "<series name>", "influence": <integer 5-50>},
    {"series": "<series name>", "influence": <integer 5-50>},
    {"series": "<series name>", "influence": <integer 5-50>}
  ]
}

Be honest and specific. Don't inflate scores. The series_dna influences should add up to roughly 100. Return ONLY valid JSON.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "AI audit failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let audit: any;
    try {
      audit = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) audit = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse audit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, audit });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
