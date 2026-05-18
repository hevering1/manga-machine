// src/app/api/add-series/route.ts
// Researches a series, generates high-converting cover art, and saves to ReferenceLibrary
import { NextRequest, NextResponse } from "next/server";

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE44_API = `https://app.base44.com/api/apps/${APP_ID}/entities/ReferenceLibrary`;
const BASE44_IMAGES = `https://app.base44.com/api/apps/${APP_ID}/images/generate`;

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Series title is required" }, { status: 400 });
    }

    // Step 1: Research the series
    const researchPrompt = `You are a manga/manhwa/manhua research expert. Research "${title}" and return a complete analysis as JSON.

Return ONLY this exact JSON structure, no markdown, no explanation:
{
  "title": "Official title",
  "type": "Manga | Manhwa | Manhua | Webtoon",
  "genre": ["genre1", "genre2"],
  "status": "Ongoing | Complete | Hiatus",
  "author": "Author name",
  "origin_country": "Japan | Korea | China | etc",
  "tone": "Brief tone description",
  "time_period_setting": "Modern | Medieval | Ancient | Futuristic | etc",
  "world_building": "2-3 sentence description of the world/setting",
  "power_system": "2-3 sentence description of how powers/abilities work",
  "protagonist_archetype": "Archetype label + 1 sentence description",
  "antagonist_archetype": "Archetype label + 1 sentence description",
  "side_character_strengths": "1-2 sentence description of notable side characters",
  "pacing_style": "Fast | Slow Burn | Explosive then slow | etc",
  "art_style_notes": "Brief description of the art style, panel composition, color palette",
  "chapter_count": "Approximate number like '400+' or '179'",
  "what_made_it_great": "2-3 sentences on why it succeeded",
  "virality_factors": "Comma-separated list of key viral moments or hooks",
  "best_story_arcs": "Comma-separated list of best arcs",
  "weaknesses": "1-2 sentences on weaknesses or criticisms",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "cover_prompt": "A highly detailed manga/manhwa cover art prompt for this series — describe the protagonist's appearance, key visual elements, color palette, atmosphere, art style, and emotional tone. Make it cinematic and high-converting. End with: Vertical portrait format, professional manga cover art, detailed linework, dramatic lighting."
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
        messages: [{ role: "user", content: researchPrompt }],
        temperature: 0.3,
        max_tokens: 1800,
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({ error: "AI research failed" }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let seriesData: any;
    try {
      seriesData = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) seriesData = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse research output" }, { status: 500 });
    }

    // Step 2: Generate cover art using the AI-crafted prompt
    let coverImageUrl = "";
    try {
      const coverPrompt = seriesData.cover_prompt ||
        `High-converting manga/manhwa cover art for "${title}". ${seriesData.tone || ""}. ${seriesData.protagonist_archetype || ""}. Cinematic dramatic lighting, professional manga art style, vertical portrait format, detailed linework.`;

      const coverRes = await fetch("https://api.openai.com/v1/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: coverPrompt,
          n: 1,
          size: "1024x1792",
          quality: "hd",
          style: "vivid",
        }),
      });

      if (coverRes.ok) {
        const coverData = await coverRes.json();
        const tempUrl = coverData.data?.[0]?.url;

        if (tempUrl) {
          // Upload to Base44 CDN for permanent storage
          const uploadRes = await fetch(`https://app.base44.com/api/apps/${APP_ID}/upload-image-from-url`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.BASE44_API_KEY}`,
            },
            body: JSON.stringify({ url: tempUrl }),
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            coverImageUrl = uploadData.url || tempUrl;
          } else {
            coverImageUrl = tempUrl;
          }
        }
      }
    } catch (coverErr) {
      console.error("Cover generation failed:", coverErr);
      // Non-fatal — continue without cover
    }

    // Step 3: Save to Base44 entity
    const payload = {
      title: seriesData.title || title,
      type: seriesData.type,
      genre: Array.isArray(seriesData.genre) ? seriesData.genre : [seriesData.genre],
      status: seriesData.status,
      author: seriesData.author,
      origin_country: seriesData.origin_country,
      tone: seriesData.tone,
      time_period_setting: seriesData.time_period_setting,
      world_building: seriesData.world_building,
      power_system: seriesData.power_system,
      protagonist_archetype: seriesData.protagonist_archetype,
      antagonist_archetype: seriesData.antagonist_archetype,
      side_character_strengths: seriesData.side_character_strengths,
      pacing_style: seriesData.pacing_style,
      art_style_notes: seriesData.art_style_notes,
      chapter_count: seriesData.chapter_count,
      what_made_it_great: seriesData.what_made_it_great,
      virality_factors: seriesData.virality_factors,
      best_story_arcs: seriesData.best_story_arcs,
      weaknesses: seriesData.weaknesses,
      tags: Array.isArray(seriesData.tags) ? seriesData.tags : [seriesData.tags],
      research_status: "Complete",
      cover_image: coverImageUrl,
    };

    const saveRes = await fetch(BASE44_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BASE44_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!saveRes.ok) {
      const err = await saveRes.text();
      return NextResponse.json({ error: "Save failed", details: err }, { status: 500 });
    }

    const saved = await saveRes.json();
    return NextResponse.json({ success: true, series: { ...payload, id: saved.id } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
