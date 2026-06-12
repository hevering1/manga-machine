// src/app/api/dialogue/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { scene, tone, bubbleType, characters } = await req.json();

    const charBlock = characters?.length
      ? characters.map((c: any) => `- ${c.name} (${c.role}): speaks in a ${c.voice || "distinct"} voice`).join("\n")
      : "- Characters are unnamed; use context clues";

    const prompt = `You are an expert manga letterer and dialogue writer. Write authentic, punchy manga dialogue for this scene.

SCENE: ${scene}
TONE: ${tone}
PRIMARY BUBBLE TYPE: ${bubbleType}
CHARACTERS:
${charBlock}

Generate 6-8 lines of dialogue/text for this scene. Mix bubble types as needed (speech, shout, whisper, thought, narration, sfx).

Return ONLY a valid JSON object:
{
  "lines": [
    {
      "character": "character name or 'Narrator' for captions",
      "bubble_type": "speech | shout | whisper | thought | narration | sfx",
      "text": "The actual text (keep it SHORT — max 12 words for speech, max 4 for SFX)",
      "direction": "Acting/delivery note for the artist (e.g. 'gritted teeth, veins on neck' or 'small font, barely audible')"
    }
  ]
}

RULES:
- Manga dialogue is SHORT and punchy. Cut every unnecessary word.
- Shouts use bold/caps energy. Whispers are fragmented.
- SFX should be onomatopoeia (BOOM, CRACK, WHOOSH, THUD, etc.)
- Match the ${tone} tone throughout
- Make each line feel distinct to that character's voice
- Return ONLY valid JSON`;

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
        max_tokens: 1200,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "AI call failed" }, { status: 500 });

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let result;
    try { result = JSON.parse(raw); }
    catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Parse failed" }, { status: 500 });
    }

    return NextResponse.json({ lines: result.lines || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
