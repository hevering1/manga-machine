// src/app/api/power-system/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BIBLES_API = `https://app.base44.com/api/apps/${APP_ID}/entities/SeriesBible`;

export async function POST(req: NextRequest) {
  try {
    const { bibleId, customContext } = await req.json();

    let context = customContext;
    if (bibleId) {
      const res = await fetch(`${BIBLES_API}/${bibleId}`, {
        headers: { "Authorization": `Bearer ${process.env.BASE44_API_KEY}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const bible = await res.json();
        context = `Series: ${bible.series_title}. ${bible.elevator_pitch}. Power System: ${bible.power_system_name} — ${bible.power_system}. World: ${bible.world_building}. Tone: ${bible.tone}. Protagonist: ${bible.protagonist_archetype}.`;
      }
    }

    const prompt = `You are an elite manga power system architect. Design a detailed, satisfying power system for this series.

Context:
${context}

Return ONLY a JSON object:
{
  "name": "Power system name",
  "concept": "2-3 sentence high-level concept — what makes this system unique and satisfying to read",
  "mechanics": "Detailed explanation of how the system works mechanically — rules, interactions, limitations",
  "tiers": [
    {"rank": "F", "label": "Tier label", "color": "#808080", "users": "Approximate population", "desc": "What this tier can do", "abilities": "Typical abilities at this tier"},
    {"rank": "E", "label": "Tier label", "color": "#10b981", "users": "~population", "desc": "Capabilities description", "abilities": ""},
    {"rank": "D", "label": "Tier label", "color": "#3b82f6", "users": "~population", "desc": "Capabilities description", "abilities": ""},
    {"rank": "C", "label": "Tier label", "color": "#8b5cf6", "users": "~population", "desc": "Capabilities description", "abilities": ""},
    {"rank": "B", "label": "Tier label", "color": "#f59e0b", "users": "~population", "desc": "Capabilities description", "abilities": ""},
    {"rank": "A", "label": "Tier label", "color": "#ff4d6d", "users": "Very rare", "desc": "Capabilities description", "abilities": ""},
    {"rank": "S", "label": "Tier label", "color": "#ff0000", "users": "Legendary few", "desc": "Capabilities description", "abilities": ""}
  ],
  "acquisition": "How do people gain powers? What determines their rank?",
  "limits": "What are the hard limits? What can the system NOT do? What costs does using power carry?",
  "evolution": "Can powers evolve? Under what conditions? What drives growth?",
  "unique_abilities": [
    "A specific signature ability or skill unique to this system",
    "Another unique mechanic or special ability",
    "A rare or legendary ability that serves as a major story goal",
    "A forbidden or dangerous ability"
  ]
}

Make the tiers feel earned and the progression satisfying. The limits should create natural dramatic tension. Return ONLY valid JSON.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "Power system generation failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();
    let system: any;
    try { system = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); if (m) system = JSON.parse(m[0]); else return NextResponse.json({ error: "Parse failed" }, { status: 500 }); }

    return NextResponse.json({ success: true, system });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
