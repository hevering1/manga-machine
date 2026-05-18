"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ChevronRight, RotateCw, Copy, Check, BookOpen, Star, Globe, Swords, Users, AlertTriangle, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

const genres = ["Shonen Action", "Dark Fantasy", "Isekai", "Psychological", "Sci-Fi", "Romance Action", "Historical", "Horror Survival", "Cultivation", "Nation Building"];
const protagonists = ["Weakest to Strongest", "Genius Tactician", "Anti-Hero", "Underdog Hidden Genius", "Revenge Arc", "Overpowered Reincarnated", "Ancient Master Reborn", "Strategic Expert"];
const settings = ["Modern World + Gates", "Medieval Fantasy", "Ancient Cultivation World", "Dystopian Future", "Tower Realm", "Multi-Nation Empire", "Post-Apocalypse", "Divine Hierarchy World"];
const tones = ["Dark & Gritty", "Epic & Grand", "Psychological Thriller", "Cold & Methodical", "Emotional Drama", "Pure Action", "Strategic Mind Game"];
const powerTypes = ["Skill Evolution System", "Cultivation Tiers", "Absorption / Mimicry", "Nation Building + Combat", "Divine Zodiac System", "Tower Floor Mechanics", "Forbidden Ancient Arts", "Clone / Replication"];

const APP_ID = "69eb83a3def5ae18fa5c7c1a";
const BASE_URL = `https://app.base44.com/api/apps/${APP_ID}`;

interface Reference {
  id: string;
  title: string;
  genre: string[];
  power_system: string;
  protagonist_archetype: string;
  tone: string;
  tags: string[];
}

interface StoryResult {
  series_title: string;
  tagline: string;
  elevator_pitch: string;
  world_name: string;
  world_building: string;
  power_system_name: string;
  power_system: string;
  protagonist_name: string;
  protagonist_background: string;
  protagonist_archetype: string;
  antagonist_name: string;
  antagonist_motivation: string;
  antagonist_archetype: string;
  supporting_cast: { name: string; role: string; description: string }[];
  core_themes: string[];
  tone: string;
  virality_hooks: string[];
  chapter_arc_structure: { arc_name: string; chapters: string; summary: string }[];
  first_10_chapters: { chapter: number; title: string; summary: string; hook: string }[];
  what_makes_it_original: string;
  target_audience: string;
  comparable_series: string[];
}

function Chip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active ? "text-white border-transparent" : "bg-ink-700 text-ink-300 border-white/10 hover:border-white/30 hover:text-white"
      }`}
      style={active ? { backgroundColor: color, borderColor: color } : {}}
    >
      {label}
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-ink-300 uppercase tracking-wider font-semibold mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 bg-ink-800 hover:bg-ink-700 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon size={14} className="text-crimson-400" />
          {title}
        </div>
        {open ? <ChevronUp size={14} className="text-ink-400" /> : <ChevronDown size={14} className="text-ink-400" />}
      </button>
      {open && <div className="p-4 bg-ink-900 text-sm text-ink-200 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function StoryEngine() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    genre: "", protagonist: "", setting: "", tone: "", power: "",
    themes: "", references: [] as string[]
  });
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [refLibrary, setRefLibrary] = useState<Reference[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/entities/ReferenceLibrary/`)
      .then(r => r.json())
      .then(data => {
        setRefLibrary(Array.isArray(data) ? data : []);
        setLoadingRefs(false);
      })
      .catch(() => setLoadingRefs(false));
  }, []);

  const toggle = (key: keyof typeof config, val: string) => {
    if (key === "references") {
      const refs = config.references;
      setConfig(c => ({
        ...c, references: refs.includes(val) ? refs.filter(r => r !== val) : [...refs, val]
      }));
    } else {
      setConfig(c => ({ ...c, [key]: c[key] === val ? "" : val }));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setStory(null);

    const selectedRefs = refLibrary.filter(r => config.references.includes(r.title)).map(r => r.id);

    try {
      const res = await fetch(`${BASE_URL}/functions/storyEngine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone: config.tone || "Dark Epic",
          genre: config.genre || "Action Fantasy",
          themes: config.themes || "Revenge, Power, Identity",
          powerSystemStyle: config.power || "Skill evolution with unique mechanics",
          protagonistType: config.protagonist || "Hidden Genius / Underdog",
          worldScale: config.setting || "Epic multi-nation",
          referenceIds: selectedRefs.length > 0 ? selectedRefs : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.story) {
        setStory(data.story);
      } else {
        setError(data.error || "Generation failed. Try again.");
      }
    } catch (e: any) {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!story) return;
    const text = JSON.stringify(story, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = ["Genre & Tone", "Characters", "World & Power", "References", "Generate"];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-gradient-red">STORY ENGINE</h1>
          <p className="text-ink-300 text-sm mt-1">Configure your DNA. Generate your empire.</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-crimson-600/20 text-crimson-400 border border-crimson-600/30 animate-pulse">
          🔴 AI ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Config Panel */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    step === i ? "bg-crimson-600 text-white" : "bg-ink-600 text-ink-300 hover:text-white"
                  }`}
                >
                  {i + 1}. {s}
                </button>
                {i < steps.length - 1 && <ChevronRight size={12} className="text-ink-500" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Section label="Genre">
                  {genres.map(g => (
                    <Chip key={g} label={g} active={config.genre === g} color="#ff4d6d" onClick={() => toggle("genre", g)} />
                  ))}
                </Section>
                <Section label="Tone">
                  {tones.map(t => (
                    <Chip key={t} label={t} active={config.tone === t} color="#ffd700" onClick={() => toggle("tone", t)} />
                  ))}
                </Section>
                <div>
                  <p className="text-xs text-ink-300 uppercase tracking-wider font-semibold mb-2">Core Themes</p>
                  <input
                    value={config.themes}
                    onChange={e => setConfig(c => ({ ...c, themes: e.target.value }))}
                    placeholder="e.g. Betrayal, Found Family, Identity, Revenge..."
                    className="w-full bg-ink-600 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-ink-400 focus:outline-none focus:border-crimson-500"
                  />
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Section label="Protagonist Archetype">
                  {protagonists.map(p => (
                    <Chip key={p} label={p} active={config.protagonist === p} color="#a855f7" onClick={() => toggle("protagonist", p)} />
                  ))}
                </Section>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Section label="World Setting">
                  {settings.map(s => (
                    <Chip key={s} label={s} active={config.setting === s} color="#10b981" onClick={() => toggle("setting", s)} />
                  ))}
                </Section>
                <Section label="Power System Type">
                  {powerTypes.map(p => (
                    <Chip key={p} label={p} active={config.power === p} color="#f97316" onClick={() => toggle("power", p)} />
                  ))}
                </Section>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Section label={loadingRefs ? "Loading reference library..." : `Pick reference series to inspire this story (${refLibrary.length} available)`}>
                  {loadingRefs ? (
                    <div className="text-ink-400 text-xs">Loading...</div>
                  ) : refLibrary.length === 0 ? (
                    <div className="text-ink-400 text-xs">No series in library yet.</div>
                  ) : (
                    refLibrary.map(r => (
                      <Chip key={r.id} label={r.title} active={config.references.includes(r.title)} color="#00d4ff" onClick={() => toggle("references", r.title)} />
                    ))
                  )}
                </Section>
                <p className="text-xs text-ink-400 mt-1">Leave all unselected to draw from the entire library automatically.</p>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-ink-800 rounded-xl p-4 border border-white/5 space-y-2 text-sm mb-4">
                  <p className="text-ink-300 font-semibold mb-3 text-xs uppercase tracking-wider">Your Configuration</p>
                  {[
                    ["Genre", config.genre || "Auto"],
                    ["Tone", config.tone || "Auto"],
                    ["Themes", config.themes || "Auto"],
                    ["Protagonist", config.protagonist || "Auto"],
                    ["Setting", config.setting || "Auto"],
                    ["Power System", config.power || "Auto"],
                    ["References", config.references.length > 0 ? config.references.join(", ") : "Full library"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <span className="text-ink-400 text-xs uppercase tracking-wide">{k}</span>
                      <span className="text-white text-xs text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-3 rounded-xl bg-ink-600 text-white text-sm hover:bg-ink-500 transition-colors">
                Back
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} className="flex-1 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                {generating ? <RotateCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {generating ? "Synthesizing story bible..." : "Generate Story Bible"}
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl p-3">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="rounded-xl bg-ink-900 border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-ink-800">
            <div className="flex items-center gap-2 text-xs text-ink-300 font-semibold uppercase tracking-wider">
              <BookOpen size={12} />
              Story Bible Output
            </div>
            {story && (
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-ink-300 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {generating && (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-ink-400">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-crimson-600/30 rounded-full animate-spin border-t-crimson-600" />
                  <Sparkles size={20} className="absolute inset-0 m-auto text-crimson-400" />
                </div>
                <p className="text-sm text-center">Synthesizing your story bible from {refLibrary.length} reference series...<br/><span className="text-xs text-ink-500">~20 seconds</span></p>
              </div>
            )}

            {!generating && !story && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-ink-500">
                <Zap size={32} className="text-ink-600" />
                <p className="text-sm text-center">Configure your settings and hit Generate.<br/>Your complete story bible will appear here.</p>
              </div>
            )}

            {story && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="text-center pb-4 border-b border-white/5">
                  <h2 className="font-display text-2xl tracking-widest text-gradient-red mb-1">{story.series_title}</h2>
                  <p className="text-yellow-400 text-sm font-semibold italic">"{story.tagline}"</p>
                  <p className="text-ink-300 text-xs mt-2 leading-relaxed">{story.elevator_pitch}</p>
                </div>

                <CollapsibleSection title={`World: ${story.world_name}`} icon={Globe} defaultOpen={true}>
                  {story.world_building}
                </CollapsibleSection>

                <CollapsibleSection title={`Power System: ${story.power_system_name}`} icon={Zap} defaultOpen={true}>
                  {story.power_system}
                </CollapsibleSection>

                <CollapsibleSection title={`Protagonist: ${story.protagonist_name}`} icon={Star} defaultOpen={true}>
                  <p><span className="text-crimson-400 font-semibold">Archetype:</span> {story.protagonist_archetype}</p>
                  <p className="mt-2">{story.protagonist_background}</p>
                </CollapsibleSection>

                <CollapsibleSection title={`Antagonist: ${story.antagonist_name}`} icon={Swords}>
                  <p><span className="text-crimson-400 font-semibold">Archetype:</span> {story.antagonist_archetype}</p>
                  <p className="mt-2"><span className="text-crimson-400 font-semibold">Motivation:</span> {story.antagonist_motivation}</p>
                </CollapsibleSection>

                <CollapsibleSection title="Supporting Cast" icon={Users}>
                  {story.supporting_cast?.map((c, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="text-white font-semibold">{c.name} <span className="text-ink-400 font-normal text-xs">— {c.role}</span></p>
                      <p className="text-ink-300 text-xs mt-1">{c.description}</p>
                    </div>
                  ))}
                </CollapsibleSection>

                <CollapsibleSection title="Virality Hooks 🔥" icon={TrendingUp} defaultOpen={true}>
                  <ul className="space-y-2">
                    {story.virality_hooks?.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-crimson-400 font-bold text-xs mt-0.5">{i + 1}.</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>

                <CollapsibleSection title="Story Arc Structure" icon={BookOpen}>
                  {story.chapter_arc_structure?.map((arc, i) => (
                    <div key={i} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-0 border-white/5">
                      <p className="text-white font-semibold">{arc.arc_name} <span className="text-ink-400 font-normal text-xs">Ch. {arc.chapters}</span></p>
                      <p className="text-ink-300 text-xs mt-1">{arc.summary}</p>
                    </div>
                  ))}
                </CollapsibleSection>

                <CollapsibleSection title="First 10 Chapters" icon={BookOpen}>
                  {story.first_10_chapters?.map((ch, i) => (
                    <div key={i} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-0 border-white/5">
                      <p className="text-white font-semibold text-xs">Ch.{ch.chapter}: {ch.title}</p>
                      <p className="text-ink-300 text-xs mt-1">{ch.summary}</p>
                      <p className="text-yellow-400 text-xs mt-1 italic">↳ {ch.hook}</p>
                    </div>
                  ))}
                </CollapsibleSection>

                <div className="flex flex-wrap gap-2 pt-2">
                  {story.core_themes?.map((t, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-crimson-600/20 text-crimson-400 border border-crimson-600/20">{t}</span>
                  ))}
                </div>
                <p className="text-ink-500 text-xs">Comparable: {story.comparable_series?.join(", ")}</p>
                <p className="text-ink-500 text-xs italic">{story.what_makes_it_original}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
