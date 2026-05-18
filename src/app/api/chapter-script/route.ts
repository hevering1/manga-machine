// src/app/api/chapter-script/route.ts
// Generates a full chapter script with prose, dialogue, and panel notes
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/ChapterScript`;

export async function POST(req: NextRequest) {
  try {
    const { story, chapter, saveToVault = true } = await req.json();

    const chapterData = story.first_10_chapters?.find((c: any) => c.chapter === chapter);
    const arc = story.chapter_arc_structure?.[0];

    const prompt = `You are an elite manga/manhwa script writer. Write a full chapter script for Chapter ${chapter} of "${story.series_title}".

SERIES CONTEXT:
- Tagline: ${story.tagline}
- World: ${story.world_name} — ${story.world_building}
- Power System: ${story.power_system_name} — ${story.power_system}
- Protagonist: ${story.protagonist_name} (${story.protagonist_archetype}) — ${story.protagonist_background}
- Antagonist: ${story.antagonist_name} — ${story.antagonist_motivation}
- Tone: ${story.tone}
- Core Themes: ${Array.isArray(story.core_themes) ? story.core_themes.join(", ") : story.core_themes}
- Arc: ${arc?.arc_name} — ${arc?.summary}

CHAPTER ${chapter} INFO:
- Title: "${chapterData?.title || `Chapter ${chapter}`}"
- Summary: ${chapterData?.summary || "Continue the story naturally from context."}
- Cliffhanger Hook: ${chapterData?.hook || "End on a powerful moment."}

Write the full chapter script with:
1. Scene breakdowns (SCENE 1, SCENE 2, etc.)
2. Panel-by-panel descriptions within each scene (PANEL 1, PANEL 2...)
3. Actual dialogue with character names in CAPS before each line
4. Narration boxes in [NARRATION: text] format
5. Sound effects in (SFX: text) format
6. Emotional direction notes in *italics-style* using asterisks
7. End with a HOOK panel that sets up the next chapter

Target: 20-25 panels across 4-6 scenes. Make the dialogue feel natural and the action visceral. Every panel should be visually interesting.

Return as a JSON object with keys:
{
  "chapter_title": "string",
  "arc_name": "string", 
  "scene_count": number,
  "panel_count": number,
  "script": "full script as a single string with \\n for line breaks",
  "panel_notes": "comma-separated list of key visual moments for the artist"
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
        temperature: 0.85,
        max_tokens: 3500,
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
      else return NextResponse.json({ error: "Failed to parse script output" }, { status: 500 });
    }

    // Auto-save to vault if requested
    let savedId: string | null = null;
    if (saveToVault && story.bible_id) {
      try {
        const saveRes = await fetch(BASE44_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.BASE44_SERVICE_TOKEN}`,
          },
          body: JSON.stringify({
            bible_id: story.bible_id,
            series_title: story.series_title,
            chapter_number: chapter,
            chapter_title: result.chapter_title || chapterData?.title || `Chapter ${chapter}`,
            arc_name: result.arc_name || arc?.arc_name || "",
            script: result.script,
            panel_notes: result.panel_notes,
            status: "Draft",
          }),
        });
        if (saveRes.ok) {
          const saved = await saveRes.json();
          savedId = saved.id;
        }
      } catch {}
    }

    return NextResponse.json({ success: true, chapter, result, savedId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
