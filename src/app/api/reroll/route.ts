// src/app/api/reroll/route.ts
// Regenerates a single section of an existing story bible
import { NextRequest, NextResponse } from "next/server";

const SECTION_PROMPTS: Record<string, (story: any) => string> = {
  power_system: (s) => `You are an elite manga story architect. Given this series context, generate a COMPLETELY DIFFERENT and more creative power system. Return ONLY a JSON object with keys: power_system_name (string), power_system (3-4 sentences).

Series: "${s.series_title}" — ${s.elevator_pitch}
World: ${s.world_name} — ${s.world_building}
Protagonist: ${s.protagonist_name} (${s.protagonist_archetype})
Current power system to REPLACE: ${s.power_system_name} — ${s.power_system}

Be wildly creative. Make the mechanics feel fresh and satisfying. Return ONLY valid JSON.`,

  protagonist: (s) => `You are an elite manga story architect. Generate a COMPLETELY DIFFERENT protagonist for this series. Return ONLY a JSON object with keys: protagonist_name (string), protagonist_background (3-4 sentences), protagonist_archetype (string).

Series: "${s.series_title}" — ${s.elevator_pitch}
World: ${s.world_name}
Power System: ${s.power_system_name} — ${s.power_system}
Current protagonist to REPLACE: ${s.protagonist_name} (${s.protagonist_archetype})

Return ONLY valid JSON.`,

  antagonist: (s) => `You are an elite manga story architect. Generate a COMPLETELY DIFFERENT antagonist for this series. Return ONLY a JSON object with keys: antagonist_name (string), antagonist_motivation (2-3 sentences), antagonist_archetype (string).

Series: "${s.series_title}" — ${s.elevator_pitch}
Protagonist: ${s.protagonist_name} (${s.protagonist_archetype})
Current antagonist to REPLACE: ${s.antagonist_name} — ${s.antagonist_motivation}

Make them compelling, morally complex, with a motivation that creates genuine dramatic tension. Return ONLY valid JSON.`,

  world: (s) => `You are an elite manga story architect. Generate a COMPLETELY DIFFERENT world concept for this series. Return ONLY a JSON object with keys: world_name (string), world_building (3-4 sentences).

Series title: "${s.series_title}"
Tone: ${s.tone}
Power System: ${s.power_system_name} — ${s.power_system}
Protagonist: ${s.protagonist_name} (${s.protagonist_archetype})
Current world to REPLACE: ${s.world_name} — ${s.world_building}

Be ambitious. Create something with deep mythology and unexplored potential. Return ONLY valid JSON.`,

  virality_hooks: (s) => `You are an elite manga story architect. Generate 5 COMPLETELY DIFFERENT virality hooks for this series. These are the moments/mechanics designed to go viral and keep readers addicted. Return ONLY a JSON object with key: virality_hooks (array of 5 strings).

Series: "${s.series_title}" — ${s.elevator_pitch}
Protagonist: ${s.protagonist_name} (${s.protagonist_archetype})
Power System: ${s.power_system_name} — ${s.power_system}
Current hooks to REPLACE: ${JSON.stringify(s.virality_hooks)}

Think chapter-ending cliffhangers, power reveals, identity twists, emotional gut-punches. Return ONLY valid JSON.`,

  supporting_cast: (s) => `You are an elite manga story architect. Generate 3 COMPLETELY DIFFERENT supporting characters for this series. Return ONLY a JSON object with key: supporting_cast (array of 3 objects, each with name, role, description).

Series: "${s.series_title}" — ${s.elevator_pitch}
Protagonist: ${s.protagonist_name} (${s.protagonist_archetype})
Antagonist: ${s.antagonist_name} (${s.antagonist_archetype})

Make each character memorable and dramatically useful. Return ONLY valid JSON.`,

  arc_structure: (s) => `You are an elite manga story architect. Generate a COMPLETELY DIFFERENT 5-arc story structure for this series. Return ONLY a JSON object with key: chapter_arc_structure (array of 5 objects, each with arc_name, chapters, summary).

Series: "${s.series_title}" — ${s.elevator_pitch}
Protagonist: ${s.protagonist_name} — ${s.protagonist_background}
Antagonist: ${s.antagonist_name} — ${s.antagonist_motivation}
Power System: ${s.power_system_name} — ${s.power_system}

Make arcs escalate dramatically. Chapter ranges: 1-25, 26-60, 61-100, 101-150, 151-200. Return ONLY valid JSON.`,

  first_chapters: (s) => `You are an elite manga story architect. Generate COMPLETELY DIFFERENT first 10 chapter breakdowns for this series. Return ONLY a JSON object with key: first_10_chapters (array of 10 objects, each with chapter number, title, summary, hook).

Series: "${s.series_title}" — ${s.elevator_pitch}
World: ${s.world_name}
Protagonist: ${s.protagonist_name} — ${s.protagonist_background}
Power System: ${s.power_system_name}
Arc 1: ${s.chapter_arc_structure?.[0]?.arc_name} — ${s.chapter_arc_structure?.[0]?.summary}

Every chapter must end on a hook that makes the reader desperate for the next one. Return ONLY valid JSON.`,
};

export async function POST(req: NextRequest) {
  try {
    const { story, section } = await req.json();

    if (!SECTION_PROMPTS[section]) {
      return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 });
    }

    const prompt = SECTION_PROMPTS[section](story);

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.95,
        max_tokens: 1500,
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({ error: "AI call failed" }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let result: any;
    try {
      result = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse AI output" }, { status: 500 });
    }

    return NextResponse.json({ success: true, section, data: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
