// src/app/api/storyboard/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prose, artStyle, pageCount, panelLayout } = await req.json();

    if (!prose?.trim()) {
      return NextResponse.json({ error: "No scene text provided" }, { status: 400 });
    }

    const prompt = `You are an elite manga storyboard artist and story structure expert. Break the following scene/story into a ${pageCount}-page visual storyboard for a ${artStyle}-style manga.

SCENE:
${prose}

PANEL LAYOUT PREFERENCE: ${panelLayout}

For each page, create ${panelLayout === "single" ? "1 panel" : panelLayout === "3_panel" ? "3 panels" : panelLayout === "webtoon" ? "4-6 panels" : "4 panels"}.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Story title or scene title (inferred from content)",
  "style": "${artStyle}",
  "total_pages": ${pageCount},
  "pages": [
    {
      "page": 1,
      "layout": "${panelLayout}",
      "scene_header": "Brief scene location/time descriptor",
      "panels": [
        {
          "panel": 1,
          "shot": "EXTREME CLOSE-UP | CLOSE-UP | MEDIUM | WIDE | ESTABLISHING | BIRD'S EYE | WORM'S EYE | OVER-THE-SHOULDER",
          "action": "What is happening visually in this panel (1-2 sentences, specific and cinematic)",
          "dialogue": "Speech bubble text, or empty string if none",
          "caption": "Narration box text, or empty string if none",
          "mood": "The emotional/visual mood of this panel (1-3 words)"
        }
      ],
      "page_hook": "The cliffhanger or emotional hook that ends this page and pulls readers to the next"
    }
  ]
}

RULES:
- Each panel must have ONE clear visual beat
- Vary shot types — mix close-ups, wides, action shots
- Keep dialogue SHORT (max 15 words per bubble)
- Every page must end on a hook
- Make the visual direction cinematic and manga-specific
- Reference character names and props from the source material
- Return ONLY valid JSON, no markdown, no explanation`;

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
        max_tokens: 3000,
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({ error: "AI call failed" }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let storyboard;
    try {
      storyboard = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) storyboard = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse AI output" }, { status: 500 });
    }

    return NextResponse.json({ storyboard });
  } catch (e: any) {
    console.error("storyboard error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
