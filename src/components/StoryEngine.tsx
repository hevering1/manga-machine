"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ChevronRight, RotateCw, Copy, Check, BookOpen, Globe, Sword, User, Users, Flame, Star, ChevronDown } from "lucide-react";

const genres = ["Shonen Action", "Dark Fantasy", "Isekai", "Psychological", "Sci-Fi", "Romance Action", "Historical", "Horror Survival", "Cultivation", "Political"];
const protagonists = ["Weakest to Strongest", "Genius Tactician", "Anti-Hero", "Hidden Genius / Underdog", "Revenge Arc", "Overpowered Hidden", "Reluctant Hero", "Fallen King Reborn", "Nation Builder"];
const settings = ["Modern World + Dungeons", "Medieval Fantasy", "Dystopian Future", "Ancient Cultivation World", "Tower / Trial System", "Urban Supernatural", "Multi-Nation Epic", "Post-Apocalyptic"];
const tones = ["Dark & Gritty", "Epic & Grand", "Psychological Thriller", "Pure Revenge", "Optimistic Power Fantasy", "Emotional Drama", "Cold & Methodical"];
const powerTypes = ["Skill Evolution System", "Cultivation Tiers", "Tower Floor System", "Absorption / Predator Style", "Divine / Zodiac System", "Martial Arts Paths", "Forbidden Ancient Arts", "Clone / Replication"];

interface ReferenceEntry {
  id: string;
  title: string;
  type: string;
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
      className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
      style={{
        borderColor: active ? color : "rgba(255,255,255,0.1)",
        backgroundColor: active ? `${color}22` : "transparent",
        color: active ? color : "#888",
      }}
    >
      {label}
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ResultSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-ink-800 hover:bg-ink-700 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          {icon} {title}
        </div>
        <ChevronDown size={14} className={`text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 py-3 bg-ink-900 text-sm text-ink-100 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function StoryEngine() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    genre: "", protagonist: "", setting: "", tone: "", power: "",
    referenceIds: [] as string[], themes: ""
  });
  const [references, setReferences] = useState<ReferenceEntry[]>([]);
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("/api/references")
      .then(r => r.json())
      .then(data => setReferences(data.references || []))
      .catch(() => {});
  }, []);

  const toggle = (key: keyof typeof config, val: string) => {
    if (key === "referenceIds") {
      const refs = config.referenceIds;
      setConfig(c => ({
        ...c, referenceIds: refs.includes(val) ? refs.filter(r => r !== val) : [...refs, val]
      }));
    } else {
      setConfig(c => ({ ...c, [key]: (c[key] as string) === val ? "" : val }));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setStory(null);
    setError("");
    try {
      const res = await fetch("/api/story-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone: config.tone || "Dark Epic",
          genre: config.genre || "Action Fantasy",
          themes: config.themes || "Revenge, Power, Identity",
          powerSystemStyle: config.power || "Unique skill-based with evolution",
          protagonistType: config.protagonist || "Hidden Genius / Underdog",
          worldScale: config.setting || "Epic multi-nation",
          referenceIds: config.referenceIds,
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setStory(data.story);
        setStep(4);
      } else {
        setError(data.error || "Generation failed. Try again.");
      }
    } catch (e) {
      setError("Network error. Check connection.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!story) return;
    navigator.clipboard.writeText(JSON.stringify(story, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = ["Genre & Tone", "Characters", "World & Power", "References", "Result"];

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-gradient-red">STORY ENGINE</h1>
          <p className="text-ink-300 text-sm mt-1">Configure your DNA. Generate your empire.</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-crimson-600/20 text-crimson-400 border border-crimson-600/30 animate-pulse">
          🔴 AI ONLINE
        </span>
      </div>

      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <button
              onClick={() => i < 4 && setStep(i)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                step === i ? "bg-crimson-600 text-white" : i < step ? "bg-ink-600 text-crimson-400 border border-crimson-600/30" : "bg-ink-700 text-ink-400"
              }`}
            >
              {i + 1}. {s}
            </button>
            {i < steps.length - 1 && <ChevronRight size={10} className="text-ink-600" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-xl bg-ink-800 border border-white/5 p-5">
              <Section label="Genre">
                {genres.map(g => <Chip key={g} label={g} active={config.genre === g} color="#ff4d6d" onClick={() => toggle("genre", g)} />)}
              </Section>
              <Section label="Tone">
                {tones.map(t => <Chip key={t} label={t} active={config.tone === t} color="#ffd700" onClick={() => toggle("tone", t)} />)}
              </Section>
              <div className="mt-2">
                <p className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-2">Core Themes</p>
                <input
                  value={config.themes}
                  onChange={e => setConfig(c => ({ ...c, themes: e.target.value }))}
                  placeholder="e.g. Revenge, Identity, Betrayal, Nation-Building..."
                  className="w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-400 focus:outline-none focus:border-crimson-500"
                />
              </div>
            </div>
            <button onClick={() => setStep(1)} className="mt-4 w-full py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm flex items-center justify-center gap-2">
              Next: Characters <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-xl bg-ink-800 border border-white/5 p-5">
              <Section label="Protagonist Archetype">
                {protagonists.map(p => <Chip key={p} label={p} active={config.protagonist === p} color="#a855f7" onClick={() => toggle("protagonist", p)} />)}
              </Section>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(0)} className="px-5 py-3 rounded-xl bg-ink-700 text-white text-sm hover:bg-ink-600">Back</button>
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm flex items-center justify-center gap-2">
                Next: World & Power <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-xl bg-ink-800 border border-white/5 p-5">
              <Section label="World Setting">
                {settings.map(s => <Chip key={s} label={s} active={config.setting === s} color="#10b981" onClick={() => toggle("setting", s)} />)}
              </Section>
              <Section label="Power System Type">
                {powerTypes.map(p => <Chip key={p} label={p} active={config.power === p} color="#f97316" onClick={() => toggle("power", p)} />)}
              </Section>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl bg-ink-700 text-white text-sm hover:bg-ink-600">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm flex items-center justify-center gap-2">
                Next: References <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-xl bg-ink-800 border border-white/5 p-5">
              <p className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-1">Select Reference Series (optional)</p>
              <p className="text-ink-400 text-xs mb-4">The AI will synthesize patterns from selected references to inspire your new series.</p>
              {references.length === 0 ? (
                <p className="text-ink-500 text-sm">Loading library...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {references.map(r => (
                    <Chip key={r.id} label={r.title} active={config.referenceIds.includes(r.id)} color="#00d4ff" onClick={() => toggle("referenceIds", r.id)} />
                  ))}
                </div>
              )}
              {config.referenceIds.length > 0 && (
                <p className="text-xs text-crimson-400 mt-3">{config.referenceIds.length} reference{config.referenceIds.length > 1 ? "s" : ""} selected</p>
              )}
            </div>
            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl bg-ink-700 text-white text-sm hover:bg-ink-600">Back</button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                {generating ? <RotateCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {generating ? "Generating Story Bible..." : "Generate Story Bible"}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && story && (
          <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-xl bg-gradient-to-br from-crimson-900/40 to-ink-900 border border-crimson-600/30 p-6 mb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl tracking-widest text-white mb-1">{story.series_title}</h2>
                  <p className="text-crimson-400 font-semibold text-sm italic mb-3">"{story.tagline}"</p>
                  <p className="text-ink-200 text-sm leading-relaxed">{story.elevator_pitch}</p>
                </div>
                <button onClick={handleCopy} className="flex-shrink-0 p-2 rounded-lg bg-ink-700 hover:bg-ink-600 text-white">
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {story.core_themes.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-crimson-600/20 text-crimson-300 border border-crimson-600/30">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {["overview", "power", "characters", "arcs", "chapters", "hooks"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-all ${activeTab === tab ? "bg-crimson-600 text-white" : "bg-ink-700 text-ink-300 hover:text-white"}`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-3">
                <ResultSection icon={<Globe size={14} className="text-emerald-400" />} title={`World: ${story.world_name}`}>
                  <p>{story.world_building}</p>
                </ResultSection>
                <ResultSection icon={<Star size={14} className="text-yellow-400" />} title="What Makes It Original">
                  <p>{story.what_makes_it_original}</p>
                </ResultSection>
                <ResultSection icon={<BookOpen size={14} className="text-blue-400" />} title="Comparable Series">
                  <div className="flex flex-wrap gap-2">
                    {story.comparable_series.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/30">{s}</span>
                    ))}
                  </div>
                </ResultSection>
              </div>
            )}
            {activeTab === "power" && (
              <ResultSection icon={<Zap size={14} className="text-yellow-400" />} title={`Power System: ${story.power_system_name}`}>
                <p>{story.power_system}</p>
              </ResultSection>
            )}
            {activeTab === "characters" && (
              <div className="space-y-3">
                <ResultSection icon={<User size={14} className="text-purple-400" />} title={`Protagonist: ${story.protagonist_name}`}>
                  <p className="text-xs text-ink-400 mb-1 uppercase tracking-wider">{story.protagonist_archetype}</p>
                  <p>{story.protagonist_background}</p>
                </ResultSection>
                <ResultSection icon={<Sword size={14} className="text-red-400" />} title={`Antagonist: ${story.antagonist_name}`}>
                  <p className="text-xs text-ink-400 mb-1 uppercase tracking-wider">{story.antagonist_archetype}</p>
                  <p>{story.antagonist_motivation}</p>
                </ResultSection>
                <ResultSection icon={<Users size={14} className="text-blue-400" />} title="Supporting Cast">
                  <div className="space-y-3">
                    {story.supporting_cast.map((c, i) => (
                      <div key={i} className="border-l-2 border-crimson-600/40 pl-3">
                        <p className="font-semibold text-white">{c.name} <span className="text-xs text-ink-400 font-normal">— {c.role}</span></p>
                        <p className="text-ink-300 text-xs mt-0.5">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </ResultSection>
              </div>
            )}
            {activeTab === "arcs" && (
              <div className="space-y-3">
                {story.chapter_arc_structure.map((arc, i) => (
                  <div key={i} className="rounded-xl bg-ink-800 border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white text-sm">{arc.arc_name}</p>
                      <span className="text-xs text-crimson-400 bg-crimson-600/10 px-2 py-0.5 rounded-full border border-crimson-600/20">Ch. {arc.chapters}</span>
                    </div>
                    <p className="text-ink-300 text-xs leading-relaxed">{arc.summary}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "chapters" && (
              <div className="space-y-2">
                {story.first_10_chapters.map((ch, i) => (
                  <div key={i} className="rounded-xl bg-ink-800 border border-white/5 p-4">
                    <p className="font-semibold text-white text-sm mb-1">Ch.{ch.chapter}: {ch.title}</p>
                    <p className="text-ink-300 text-xs leading-relaxed mb-2">{ch.summary}</p>
                    <p className="text-xs text-crimson-400 italic">🔥 {ch.hook}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "hooks" && (
              <div className="space-y-2">
                {story.virality_hooks.map((hook, i) => (
                  <div key={i} className="rounded-xl bg-ink-800 border border-crimson-600/20 p-4 flex items-start gap-3">
                    <span className="text-crimson-500 font-bold text-sm flex-shrink-0">#{i + 1}</span>
                    <p className="text-ink-100 text-sm">{hook}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setStory(null); setStep(0); setConfig({ genre: "", protagonist: "", setting: "", tone: "", power: "", referenceIds: [], themes: "" }); }}
                className="px-5 py-3 rounded-xl bg-ink-700 text-white text-sm hover:bg-ink-600">
                New Generation
              </button>
              <button onClick={handleCopy} className="flex-1 py-3 rounded-xl bg-ink-700 hover:bg-ink-600 text-white font-semibold text-sm flex items-center justify-center gap-2">
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Full Bible (JSON)"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
