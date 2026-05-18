// src/app/api/power-stress-test/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { system } = await req.json();

    const prompt = `You are a manga storytelling expert who specializes in finding plot holes and power scaling issues in ability systems.

Perform a rigorous "stress test" on this power system and identify any inconsistencies, plot holes, power scaling problems, or narrative issues.

POWER SYSTEM:
Name: ${system.name}
Concept: ${system.concept}
Mechanics: ${system.mechanics}
Tiers: ${JSON.stringify(system.tiers)}
Acquisition: ${system.acquisition}
Limits: ${system.limits}
Evolution: ${system.evolution}

Return ONLY a JSON object:
{
  "score": <integer 1-100, how consistent and story-friendly the system is>,
  "verdict": "<2-3 sentence overall assessment of the system's strengths and core issues>",
  "issues": [
    {"severity": "critical", "description": "<A critical issue that breaks the system or creates major plot holes>"},
    {"severity": "warning", "description": "<A warning-level inconsistency that should be addressed>"},
    {"severity": "minor", "description": "<A minor issue or edge case>"},
    {"severity": "minor", "description": "<Another minor issue>"}
  ],
  "strengths": [
    "<What the system does really well narratively>",
    "<Another strength>",
    "<Another strength>"
  ],
  "recommendations": [
    "<Specific recommendation to fix the most critical issue>",
    "<Recommendation to improve narrative potential>",
    "<Recommendation to add more dramatic tension>",
    "<Recommendation to make the system more reader-satisfying>"
  ]
}

Be specific and honest. Point out real logical contradictions. Return ONLY valid JSON.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "Stress test failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();
    let result: any;
    try { result = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); else return NextResponse.json({ error: "Parse failed" }, { status: 500 }); }

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
