// src/app/api/story-engine/route.ts
import { NextRequest, NextResponse } from "next/server";

const REFERENCE_DATA: Record<string, any> = {
  "6a0b3d047abd185de006afa2": { title: "That Time I Got Reincarnated as a Slime", power_system: "Skill-based with Unique/Extra/Ultimate Skills. Predator absorbs and replicates anything. Skills evolve through experience. As True Demon Lord, skills rewrite reality.", world_building: "Multi-nation fantasy world with humans, dwarves, elves, beastmen, demons, spirits. Rimuru builds Monster Nation Tempest from scratch via diplomacy, trade, education, military.", protagonist_archetype: "Benevolent Nation Builder — starts weakest monster, ends god-king who leads through connection", what_made_it_great: "Power fantasy earned through relationships and leadership. Nation-building as a genre. Skill evolution is endlessly creative.", virality_factors: "True Demon Lord awakening, Predator skill reveals, Tempest founding, Diablo introduction, skill evolution sequences" },
  "6a0b37ea07fe7436448e7306": { title: "Star Martial God Technique", power_system: "Three-path martial arts — Flame, Dragon, Star. Star practitioners absorb star energy through cultivation tiers ascending toward godhood.", world_building: "Twelve paths to climb Tower of God. Only three martial arts survived ancient catastrophe. Generations compete for immortality.", protagonist_archetype: "Underdog Hidden Genius", what_made_it_great: "Unique star-based power system, long-form cultivation progression, compelling tower mythology.", virality_factors: "Star power awakening moments, tower climb reveals, rival faction clashes" },
  "6a0b37ea07fe7436448e7307": { title: "The Beginning After The End", power_system: "Mana core system Bronze through Gold. Above that: Aether — rare dual-affinity energy only Arthur has. Asuras on divine power. Dual attributes theoretically impossible.", world_building: "King Grey reincarnates into Dicathen — world of mana, magic beasts, academies, royal politics, ancient Asura gods, inter-dimensional war.", protagonist_archetype: "Overpowered Reincarnated King who faces genuine loss", what_made_it_great: "Subverts isekai — Arthur starts powerful but still loses. Emotional depth far above genre average.", virality_factors: "Arthur's mana awakening, tragic arc gut-punches, Asura power reveals, dual-attribute twist" },
  "6a0b37ea07fe7436448e7308": { title: "The Devil Butler", power_system: "Demon cultivation — soul force, demon beast integration, ancient scrolls. Starts at zero after reincarnation but retains all knowledge as former Demon Emperor.", world_building: "Demon cultivation determines social hierarchy. Ancient Demon Emperor Zhuo Yifan betrayed, reincarnated into frail servant boy bound to declining noble family.", protagonist_archetype: "Fallen King Reborn — most powerful being operating as a humble servant", what_made_it_great: "Dramatic irony of holding back while serving. Deeply satisfying revenge arc.", virality_factors: "Demon Emperor identity reveals, crushing enemies 'while just being a servant', power restoration moments" },
  "6a0b37ea07fe7436448e7309": { title: "The Great Mage Returns After 4000 Years", power_system: "Mana-based magic with spell tiers, elemental affinities, forbidden ancient arts. Lucas has 4000 years of knowledge but must rebuild physical mana circuits from scratch.", world_building: "Greatest mage imprisoned 4000 years by a demigod, reawakens in weakest academy student. Magic academies, noble houses, demigods who view humans as tools.", protagonist_archetype: "Ancient Master in a Weak Body — genius disguised as incompetence", what_made_it_great: "Cold calculating nature makes every reveal hit harder. 4000-year imprisonment creates massive emotional weight.", virality_factors: "First magic reveal at academy, Lucas dropping the weak act, demigod confrontation scenes" },
  "6a0b37ea07fe7436448e730a": { title: "I'm the Max-Level Newbie", power_system: "Tower floor system with unique rules per floor. Gods grant divine power to favored individuals. Protagonist's advantage is complete meta-knowledge of all 100 floors.", world_building: "Tower of Trials materializes in reality. Humanity has 90 days to ascend. Only Jinhyeok — 11-year VR veteran — knows every floor, boss, and secret.", protagonist_archetype: "Expert Gamer in Real-World Tower — knowledge as the ultimate weapon", what_made_it_great: "Expert-in-beginner's-world creates constant dramatic satisfaction. Reverse-isekai framing.", virality_factors: "Floor boss one-shots via pre-existing knowledge, watching him destroy impossible content" },
  "6a0b37ea07fe7436448e730b": { title: "Auto Hunting With My Clones", power_system: "Skill-based awakening. Sang-u's cloning scales with level — more clones, stronger clones, fully autonomous combat. Eventually a clone army surpassing elite solo hunters.", world_building: "Modern world where people awaken unique skills to fight dungeon monsters. Protagonist awakens 'Cloning' — seemingly weak, infinitely scalable.", protagonist_archetype: "Strategic Underdog — ability appears weak but is secretly the most broken at scale", what_made_it_great: "Cloning mechanic is genuinely clever. Strategic multi-clone management adds real depth.", virality_factors: "Clone army reveal moments, multi-clone simultaneous combat, hidden strength exposed" },
  "6a0b37ea07fe7436448e730c": { title: "Tales of Demons and Gods", power_system: "Soul realm cultivation — Demon Spirits bound to practitioners. Ancient techniques, demon beast integration, soul force tiers. Protagonist uses future knowledge to shortcut centuries of cultivation.", world_building: "Protagonist returns to childhood after death, retaining memories of future cataclysm. City of Orchid, Glory City, demon beast hordes, ancient ruins.", protagonist_archetype: "Reincarnated Genius with Foreknowledge — uses future knowledge to build power while preventing catastrophe", what_made_it_great: "Original foreknowledge power fantasy. Compelling city-protection stakes.", virality_factors: "Future knowledge payoffs, demon spirit evolution reveals, city defense sequences" },
  "6a0b37ea07fe7436448e730d": { title: "Return of the Disaster-Class Hero", power_system: "Hunter class system with unique skills. Protagonist Lee Gun rejected by all 12 Zodiac gods, develops own power path — becomes the only human to never be blessed yet grow stronger.", world_building: "Modern world where Zodiac gods select hunters to fight monsters. Lee Gun was framed, trapped for 20 years. Returns to find his disciple now the world's strongest — blessed by his killer.", protagonist_archetype: "Betrayed Legend Returns — isolated from the entire divine system, builds own power from scratch", what_made_it_great: "Revenge premise with unique twist: divine system actively works against him. Every win is against impossible odds.", virality_factors: "Lee Gun's first return reveal, destroying god-blessed hunters without divine power, disciple reunion scenes" },
  "6a0b37ea07fe7436448e730e": { title: "Omniscient Reader's Viewpoint", power_system: "Scenarios from constellations — beings who consume narratives like entertainment. Characters earn coins from constellations, gain skills, fulfill story flags. Protagonist's power: he's read the only novel describing how to survive.", world_building: "Earth transformed into a scenario-based apocalypse managed by cosmic constellations watching humans as characters. Reality is a story being consumed.", protagonist_archetype: "Reader-turned-protagonist — the only person who knows the full story of how the world ends", what_made_it_great: "Meta-narrative conceit is unique and deeply explored. Kim Dokja as a character is emotionally devastating.", virality_factors: "Constellation observation reveals, scenario clears, Kim Dokja's true power reveal, emotional character sacrifices" },
  "6a0a8282f446b0def04eed19": { title: "Naruto", power_system: "Chakra — ninjutsu, genjutsu, taijutsu. Bloodline limits (Sharingan, Byakugan). Senjutsu, tailed beast power, Six Paths power.", world_building: "Five great nations, hidden villages, Kage system, tailed beasts, clans. Sage of Six Paths mythology underpins everything.", protagonist_archetype: "Outcast orphan with hidden power. Grows into leader through pure conviction.", what_made_it_great: "Relatable underdog, iconic rivalries, tragic villains, conviction moments.", virality_factors: "Relatable underdog, iconic rivalries, 'this is my ninja way' conviction moments" },
  "6a0a8282f446b0def04eed1a": { title: "One Piece", power_system: "Devil Fruits (Paramecia, Logia, Zoan) and Haki (Observation, Armament, Conqueror's). Power tied to will and character development.", world_building: "Four Blues, Grand Line, New World, Poneglyphs, Void Century. Every island is distinct. Yonko, Marines, Warlords power structure.", protagonist_archetype: "Pure-hearted freedom-lover. Not smart but unshakeable conviction. Makes anyone an ally.", what_made_it_great: "25+ years of planted seeds blooming. World feels real. Marineford, Robin's past, Ace's death.", virality_factors: "Crew building, nakama moments, mystery of One Piece, shocking deaths, D. lineage mystery" },
  "6a0a8282f446b0def04eed1b": { title: "Jujutsu Kaisen", power_system: "Cursed Energy, Innate Techniques (unique per user), Domain Expansion (ultimate technique — guaranteed-hit zone). Simple but endlessly creative.", world_building: "Cursed spirits from negative human emotions. Jujutsu High trains sorcerers. Special grades, Heavenly Restriction, Six Eyes.", protagonist_archetype: "Physically elite but technique-limited. Warm and moral but exists in a world that punishes goodness.", what_made_it_great: "No plot armor. Domain expansions. Gojo. Shocking deaths. Cursed technique reveals.", virality_factors: "No plot armor, domain expansions, Gojo, shocking deaths, cursed technique reveals" },
  "6a0a8282f446b0def04eed1c": { title: "Attack on Titan", power_system: "Nine Titan powers (Attack, Armored, Colossal, Female, Beast, Jaw, Cart, War Hammer, Founding). ODM Gear for humans.", world_building: "Titans as metaphor for oppression. Marley vs Eldia political conflict. Titan powers tied to bloodline. The Rumbling as final escalation. History rewritten by victors.", protagonist_archetype: "Rage-driven idealist who becomes genocidal anti-hero. Greatest arc from victim to villain.", what_made_it_great: "Subverts every expectation. Villain was the hero. War and cycles of hatred without easy answers.", virality_factors: "Mystery of titans, wall breach, no safety, political depth, Eren's turn, the Rumbling" },
  "6a0a8282f446b0def04eed1d": { title: "Berserk", power_system: "Guts fights with pure physical power and the Berserker Armor. No magic for humans — horror is how outmatched they are. Causality and fate as forces.", world_building: "The Idea of Evil, God Hand, Apostles, Behelits. World shaped by human suffering and collective unconscious. Fantasia as nightmare made real.", protagonist_archetype: "Ultimate anti-hero. Brutal, scarred, barely holding onto humanity. Fights because giving up means Griffith wins.", what_made_it_great: "The art. Deepest protagonist in manga. The Eclipse. Griffith as a peerless villain.", virality_factors: "Art, the Eclipse event, Griffith as perfect villain, Guts as ultimate underdog" },
  "6a0a8282f446b0def04eed1e": { title: "Demon Slayer", power_system: "Breathing Styles (Water, Flame, Sound, etc.) and derivatives. Demon Blood Arts for antagonists. Marks and transparent world as peak human power.", world_building: "Demon Slayer Corps vs Demons led by Muzan. Twelve Kizuki. Taisho era Japan.", protagonist_archetype: "Pure-hearted, emotionally intelligent, determined without arrogance.", what_made_it_great: "Emotional clarity. Villain backstories create empathy mid-fight. Ufotable animation elevated everything.", virality_factors: "Animation quality, Nezuko box, breathing styles, Rengoku death, pure emotional punches" },
  "6a0a8282f446b0def04eed1f": { title: "Vinland Saga", power_system: "Pure martial skill and physical ability. No magic. Askeladd most dangerous through intelligence, not strength.", world_building: "Historically grounded. Viking society, Danish conquest of England, Norse mythology as culture. Slavery, war, search for a land without conflict.", protagonist_archetype: "Revenge-driven warrior who learns strength is not fighting. Child soldier to pacifist.", what_made_it_great: "Askeladd. Deconstruction of warrior archetype. Farm arc redefines what a protagonist's journey can be.", virality_factors: "Askeladd as GOAT side character, Thorfinn's transformation, farm arc" },
  "6a0a8282f446b0def04eed16": { title: "Solo Leveling", power_system: "Hunter ranking (E-S class), unique skills, shadow army necromancy. Clear progression — weakest to absolute strongest.", world_building: "Earth invaded by dungeons/gates. Hunters with special abilities fight monsters. Shadow Monarch mythology layered in later.", protagonist_archetype: "Underdog who becomes unstoppable god-tier. Quiet, strategic, loyal.", what_made_it_great: "Power fantasy loop is near perfect. Shadow army mechanic uniquely satisfying. Art elevates everything.", virality_factors: "Level-up system, underdog-to-god arc, stunning art, each chapter ends on power reveal" },
  "6a0a8282f446b0def04eed17": { title: "Tower of God", power_system: "Shinsu manipulation — different floors have different rules. Positions (Light Bearer, Wave Controller, etc.). Irregular powers break the tower's rules.", world_building: "The Tower is a world — different floors have unique cultures, races, politics, rules. Regulars climb for wishes. Irregulars break the rules.", protagonist_archetype: "Pure-hearted irregular who grows into something unknowable. Starts naive, becomes calculating and terrifying.", what_made_it_great: "World-building depth. Every answer raises more questions. Ensemble cast with real stakes.", virality_factors: "Mystery of the tower, irregular status, massive lore, unforgettable ensemble" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tone, genre, themes, powerSystemStyle, protagonistType, worldScale, referenceIds } = body;

    // Build reference context
    let selectedRefs: any[] = [];
    if (referenceIds && referenceIds.length > 0) {
      selectedRefs = referenceIds.map((id: string) => REFERENCE_DATA[id]).filter(Boolean);
    } else {
      selectedRefs = Object.values(REFERENCE_DATA);
    }

    const refContext = selectedRefs.map((r: any) =>
      `- ${r.title}: Power System: ${r.power_system} | World: ${r.world_building} | Protagonist: ${r.protagonist_archetype} | What Made It Great: ${r.what_made_it_great} | Virality: ${r.virality_factors}`
    ).join("\n");

    const prompt = `You are an elite manga/manhwa story architect. Using the reference series below as inspiration (NOT copying — synthesizing the best elements into something wholly original), generate a complete original series concept.

REFERENCE LIBRARY (use as deep inspiration only — create something wholly new):
${refContext}

USER INPUTS:
- Tone: ${tone || "Dark Epic"}
- Genre: ${genre || "Action Fantasy"}  
- Themes: ${themes || "Revenge, Power, Identity"}
- Power System Style: ${powerSystemStyle || "Unique skill-based with evolution"}
- Protagonist Type: ${protagonistType || "Hidden Genius / Underdog"}
- World Scale: ${worldScale || "Epic multi-nation"}

Generate the following in this exact JSON structure. Be maximally creative, detailed, and wholly original:

{
  "series_title": "string",
  "tagline": "string",
  "elevator_pitch": "2-3 sentences",
  "world_name": "string",
  "world_building": "3-4 sentences",
  "power_system_name": "string",
  "power_system": "3-4 sentences detailing mechanics, tiers, limits",
  "protagonist_name": "string",
  "protagonist_background": "3-4 sentences",
  "protagonist_archetype": "string",
  "antagonist_name": "string",
  "antagonist_motivation": "2-3 sentences",
  "antagonist_archetype": "string",
  "supporting_cast": [
    {"name": "string", "role": "string", "description": "2 sentences"},
    {"name": "string", "role": "string", "description": "2 sentences"},
    {"name": "string", "role": "string", "description": "2 sentences"}
  ],
  "core_themes": ["string", "string", "string", "string"],
  "tone": "string",
  "virality_hooks": ["string", "string", "string", "string", "string"],
  "chapter_arc_structure": [
    {"arc_name": "string", "chapters": "1-25", "summary": "2-3 sentences"},
    {"arc_name": "string", "chapters": "26-60", "summary": "2-3 sentences"},
    {"arc_name": "string", "chapters": "61-100", "summary": "2-3 sentences"},
    {"arc_name": "string", "chapters": "101-150", "summary": "2-3 sentences"},
    {"arc_name": "string", "chapters": "151-200", "summary": "2-3 sentences"}
  ],
  "first_10_chapters": [
    {"chapter": 1, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 2, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 3, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 4, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 5, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 6, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 7, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 8, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 9, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"},
    {"chapter": 10, "title": "string", "summary": "2 sentences", "hook": "1 sentence cliffhanger/hook"}
  ],
  "what_makes_it_original": "2-3 sentences",
  "target_audience": "string",
  "comparable_series": ["string", "string", "string"]
}

Return ONLY valid JSON. No markdown fences. No explanation. Just the JSON object.`;

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
        max_tokens: 4000,
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      return NextResponse.json({ error: "AI generation failed", details: err }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.trim();

    let story: any;
    try {
      story = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        story = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ error: "Failed to parse AI output" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, story });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
