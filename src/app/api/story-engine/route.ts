// src/app/api/story-engine/route.ts
import { NextRequest, NextResponse } from "next/server";

const REFERENCE_SERIES = [
  "Solo Leveling","Tower of God","Omniscient Reader's Viewpoint","The Beginning After The End",
  "Return of the Disaster-Class Hero","Nano Machine","Martial Peak","Tales of Demons and Gods",
  "Star Martial God Technique","That Time I Got Reincarnated as a Slime","Jujutsu Kaisen",
  "Berserk","Attack on Titan","Vinland Saga","One Piece","Naruto","Demon Slayer",
  "The Great Mage Returns After 4000 Years","The Devil Butler"
];

export async function POST(req: NextRequest) {
  try {
    const { genre, tone, powerType, setting, archetype, customPrompt } = await req.json();

    const prompt = `You are an elite manga/manhwa creative director with deep knowledge of what makes series go viral. Generate a completely original series bible that would succeed in today's market.

Reference Library (cross-pollinate elements from these, don't copy):
${REFERENCE_SERIES.join(", ")}

Configuration:
- Genre: ${genre || "your choice — pick the highest-potential option"}
- Tone: ${tone || "your choice — pick what would resonate most"}
- Power System Type: ${powerType || "your choice — make it satisfying and scalable"}
- Setting: ${setting || "your choice"}
- Protagonist Archetype: ${archetype || "your choice — pick what's most compelling"}
${customPrompt ? `- Extra Instructions: ${customPrompt}` : ""}

Create something that:
1. Has a hook powerful enough to go viral on TikTok and Reddit
2. Has clear power fantasy appeal
3. Has genuine emotional depth beyond just fighting
4. Has a power system that scales satisfyingly for 500+ chapters
5. Has an antagonist worthy of the protagonist

Return ONLY this exact JSON structure:
{
  "series_title": "The series title (punchy, memorable)",
  "tagline": "One line that makes someone want to read it immediately",
  "elevator_pitch": "3-4 sentences. Hook + premise + stakes + what makes it different",
  "world_name": "The world's name",
  "world_building": "3-4 sentences describing the world. Be specific with details.",
  "power_system_name": "The power system's name",
  "power_system": "3-4 sentences on how powers work. Include tiers, acquisition, and limits.",
  "protagonist_name": "Name fitting the world",
  "protagonist_background": "3-4 sentences. Specific backstory with a clear wound/motivation.",
  "protagonist_archetype": "Archetype label — one sentence on what makes them compelling",
  "antagonist_name": "Name",
  "antagonist_motivation": "3 sentences. Make them understandable, not just evil.",
  "antagonist_archetype": "Archetype label",
  "supporting_cast": [
    {"name": "Name", "role": "Role", "description": "2 sentence description"},
    {"name": "Name", "role": "Role", "description": "2 sentence description"},
    {"name": "Name", "role": "Role", "description": "2 sentence description"}
  ],
  "core_themes": ["Theme 1", "Theme 2", "Theme 3"],
  "tone": "Tone description",
  "virality_hooks": [
    "Hook 1: specific moment or element that will go viral",
    "Hook 2: another viral element",
    "Hook 3: another viral element",
    "Hook 4: another viral element",
    "Hook 5: another viral element"
  ],
  "chapter_arc_structure": [
    {"arc_name": "Arc 1 name", "chapters": "1-25", "summary": "What happens, what changes for protagonist"},
    {"arc_name": "Arc 2 name", "chapters": "26-60", "summary": "Escalation and new threat"},
    {"arc_name": "Arc 3 name", "chapters": "61-100", "summary": "Major revelation or power-up"},
    {"arc_name": "Arc 4 name", "chapters": "101-150", "summary": "Point of no return"},
    {"arc_name": "Arc 5 name", "chapters": "151-200", "summary": "First major climax"}
  ],
  "first_10_chapters": [
    {"chapter": 1, "title": "Chapter title", "hook": "One sentence cliffhanger or hook"},
    {"chapter": 2, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 3, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 4, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 5, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 6, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 7, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 8, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 9, "title": "Chapter title", "hook": "One sentence hook"},
    {"chapter": 10, "title": "Chapter title", "hook": "One sentence hook"}
  ],
  "what_makes_it_original": "2-3 sentences on exactly what combination of elements makes this different from everything out there",
  "target_audience": "Primary reader demographic and what they'll connect with",
  "comparable_series": ["Most comparable series 1", "Most comparable series 2", "Most comparable series 3"],
  "virality_score": <integer 60-98, honest assessment of virality potential based on hooks, originality, market fit>
}

Return ONLY valid JSON. No markdown.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 3500,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let bible: any;
    try { bible = JSON.parse(raw); }
    catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) bible = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse bible" }, { status: 500 });
    }

    return NextResponse.json({ success: true, bible });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
