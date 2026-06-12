// src/app/api/character-prompt/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { character } = await req.json();

    const prompt = `You are an expert at writing AI image generation prompts for manga/anime characters. Create a detailed, reusable art prompt for this character that will keep them visually consistent across any scene.

CHARACTER:
Name: ${character.name}
Archetype: ${character.archetype}
Age: ${character.age || "unknown"}
Hair: ${character.hair || "unspecified"}
Eyes: ${character.eyes || "unspecified"}
Marks: ${character.distinguishing_marks || "none"}
Appearance: ${character.appearance || "not described"}
Outfit: ${character.signature_outfit || "not described"}
Power: ${character.power || "none"}

Write a single, detailed art prompt (3-5 sentences) that:
1. Locks in the exact visual appearance with specific details
2. Describes art style (manga/anime, high contrast, dynamic lines)
3. Includes lighting and composition notes
4. Specifies the character's default expression/pose energy
5. Is reusable — can be used as a prefix for any scene

Return ONLY the prompt text, no JSON, no explanation.`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!aiRes.ok) return NextResponse.json({ error: "AI call failed" }, { status: 500 });
    const aiData = await aiRes.json();
    return NextResponse.json({ prompt: aiData.choices[0].message.content.trim() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
