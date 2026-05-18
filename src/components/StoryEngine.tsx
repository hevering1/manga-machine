"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, ChevronRight, RotateCw, Copy, Check, BookOpen,
  Globe, Sword, User, Users, Flame, Star, Save, FileText,
  RefreshCw, CheckCircle, Loader, X, Download, TrendingUp,
  Shuffle, ChevronDown, ChevronUp, Lock, Unlock
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────
interface BibleOutput {
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
  supporting_cast: any[];
  core_themes: string[];
  tone: string;
  virality_hooks: string[];
  chapter_arc_structure: any[];
  first_10_chapters: any[];
  what_makes_it_original: string;
  target_audience: string;
  comparable_series: string[];
  virality_score?: number;
}

// ── Config options ───────────────────────────────────────────────
const GENRES = ["Cultivation", "Hunter/Gate", "Regression", "Reincarnation", "Academy", "Dungeon Diving", "Martial Arts", "Isekai", "Apocalypse", "Political Thriller", "Dark Fantasy", "Slice of Power", "Sports", "Revenge Arc"];
const TONES = ["Dark & Gritty", "Shonen Epic", "Psychological", "Cosmic Horror", "Underdog Rise", "Cold Genius MC", "Satirical", "Tragic Hero", "Hopepunk"];
const POWER_TYPES = ["Rank System (F→S)", "Cultivation Stages", "Mana/Magic", "Unique Skills", "Divine Weapons", "Body Enhancement", "Mental Powers", "Bloodline Abilities", "Stolen Powers", "System/Status Window"];
const SETTINGS = ["Modern Korea", "Ancient China", "Near-Future Earth", "Alternate History", "Tower World", "Post-Apocalypse", "Spirit Realm", "Academy City", "Dungeon Earth", "Parallel Dimension"];
const ARCHETYPES = ["The Zero (starts at bottom)", "Regression (lived it before)", "Reincarnated God/King", "Abandoned Genius", "Hidden Monster", "Cold Strategist", "Berserker Awakening", "The Vessel (ancient power inside)"];

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Sub-components ───────────────────────────────────────────────
function ProgressSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{
                backgroundColor: i < current ? "rgba(16,185,129,0.2)" : i === current ? "rgba(255,77,109,0.2)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${i < current ? "#10b981" : i === current ? "#ff4d6d" : "rgba(255,255,255,0.1)"}`,
                color: i < current ? "#10b981" : i === current ? "#ff4d6d" : "#555",
              }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
              style={{ color: i === current ? "#fff" : i < current ? "#10b981" : "#444" }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && <ChevronRight size={12} className="text-ink-700 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

function ConfigSelect({ label, options, value, onChange, locked, onToggleLock }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
  locked?: boolean; onToggleLock?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold">{label}</label>
        {onToggleLock && (
          <button onClick={onToggleLock} className="text-ink-600 hover:text-ink-300 transition-colors">
            {locked ? <Lock size={10} className="text-crimson-400" /> : <Unlock size={10} />}
          </button>
        )}
      </div>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-ink-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-crimson-500/50 transition-colors appearance-none">
        <option value="">— Random —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function VitalityMeter({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 65 ? "#ffd700" : "#ff4d6d";
  const label = score >= 80 ? "HIGH VIRALITY" : score >= 65 ? "SOLID" : "NEEDS WORK";
  return (
    <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
          <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <motion.circle cx="30" cy="30" r="24" fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 24}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - score / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg leading-none" style={{ color }}>{score}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color }}>{label}</p>
        <p className="text-ink-400 text-xs">Virality Potential Score</p>
        <p className="text-ink-500 text-[10px] mt-0.5">Based on hooks, originality & market fit</p>
      </div>
    </div>
  );
}

function BibleSection({ title, icon, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden mb-3">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-ink-800/40 hover:bg-ink-700/30 transition-colors text-left">
        {icon}
        <span className="font-display text-sm tracking-wider text-white flex-1">{title}</span>
        {open ? <ChevronUp size={13} className="text-ink-500" /> : <ChevronDown size={13} className="text-ink-500" />}
      </button>
      {open && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}

// ── Main StoryEngine component ───────────────────────────────────
export default function StoryEngine({ setActive, addToast }: {
  setActive?: (s: string) => void;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}) {
  const [step, setStep] = useState(0); // 0=config 1=generating 2=result
  const [genStage, setGenStage] = useState(0);
  const [bible, setBible] = useState<BibleOutput | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rerolling, setRerolling] = useState<string | null>(null);

  // Config state
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [powerType, setPowerType] = useState("");
  const [setting, setSetting] = useState("");
  const [archetype, setArchetype] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [locked, setLocked] = useState<Record<string, boolean>>({});

  const GEN_STAGES = [
    "Analyzing reference library...",
    "Building world & power system...",
    "Crafting protagonist & antagonist...",
    "Writing chapter arcs...",
    "Calculating virality score...",
    "Finalizing bible...",
  ];

  const toggleLock = (key: string) => setLocked(l => ({ ...l, [key]: !l[key] }));

  const handleInspireMe = () => {
    if (!locked.genre)    setGenre(randomFrom(GENRES));
    if (!locked.tone)     setTone(randomFrom(TONES));
    if (!locked.power)    setPowerType(randomFrom(POWER_TYPES));
    if (!locked.setting)  setSetting(randomFrom(SETTINGS));
    if (!locked.archetype) setArchetype(randomFrom(ARCHETYPES));
  };

  const handleGenerate = async () => {
    setStep(1);
    setGenStage(0);
    setError("");
    setBible(null);
    setSaved(false);

    // Progress stages
    const stageTimers = GEN_STAGES.map((_, i) =>
      setTimeout(() => setGenStage(i), i * 3500)
    );

    try {
      const res = await fetch("/api/story-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, tone, powerType, setting, archetype, customPrompt }),
      });
      stageTimers.forEach(t => clearTimeout(t));

      const data = await res.json();
      if (data.error) { setError(data.error); setStep(0); return; }
      setBible(data.bible);
      setStep(2);
    } catch (e: any) {
      stageTimers.forEach(t => clearTimeout(t));
      setError(e.message);
      setStep(0);
    }
  };

  const handleSave = async () => {
    if (!bible || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save-bible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bible }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        addToast?.("Bible saved to Active Series!", "success");
      } else {
        addToast?.(data.error || "Save failed", "error");
      }
    } catch {
      addToast?.("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReroll = async (section: string) => {
    if (!bible || rerolling) return;
    setRerolling(section);
    try {
      const res = await fetch("/api/reroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bible, section }),
      });
      const data = await res.json();
      if (data.updated) {
        setBible(prev => prev ? { ...prev, ...data.updated } : prev);
        addToast?.(`${section} rerolled!`, "success");
      }
    } catch {
      addToast?.("Reroll failed", "error");
    } finally {
      setRerolling(null);
    }
  };

  const handleCopy = () => {
    if (!bible) return;
    const text = `${bible.series_title}\n"${bible.tagline}"\n\n${bible.elevator_pitch}\n\nWorld: ${bible.world_name}\n${bible.world_building}\n\nPower System: ${bible.power_system_name}\n${bible.power_system}\n\nProtagonist: ${bible.protagonist_name} (${bible.protagonist_archetype})\n${bible.protagonist_background}\n\nAntagonist: ${bible.antagonist_name}\n${bible.antagonist_motivation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STEPS = ["Configure", "Generating", "Review Bible"];

  // ── Step 0: Config ──────────────────────────────────────────────
  if (step === 0) return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="text-crimson-400" size={20} />
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">STORY ENGINE</h1>
        </div>
        <p className="text-ink-300 text-sm">Configure your series DNA. The AI cross-references your library to generate something original.</p>
      </div>

      <ProgressSteps steps={STEPS} current={0} />

      <div className="max-w-2xl space-y-5">
        {/* Inspire Me */}
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={handleInspireMe}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-display tracking-widest text-sm border transition-all"
          style={{ backgroundColor: "rgba(255,215,0,0.06)", borderColor: "rgba(255,215,0,0.2)", color: "#ffd700" }}>
          <Shuffle size={15} /> INSPIRE ME — Randomize All
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfigSelect label="Genre" options={GENRES} value={genre} onChange={setGenre}
            locked={locked.genre} onToggleLock={() => toggleLock("genre")} />
          <ConfigSelect label="Tone" options={TONES} value={tone} onChange={setTone}
            locked={locked.tone} onToggleLock={() => toggleLock("tone")} />
          <ConfigSelect label="Power System Type" options={POWER_TYPES} value={powerType} onChange={setPowerType}
            locked={locked.power} onToggleLock={() => toggleLock("power")} />
          <ConfigSelect label="Setting" options={SETTINGS} value={setting} onChange={setSetting}
            locked={locked.setting} onToggleLock={() => toggleLock("setting")} />
        </div>

        <ConfigSelect label="Protagonist Archetype" options={ARCHETYPES} value={archetype} onChange={setArchetype}
          locked={locked.archetype} onToggleLock={() => toggleLock("archetype")} />

        <div>
          <label className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold block mb-1.5">
            Extra Instructions (optional)
          </label>
          <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)}
            placeholder="Any specific ideas, themes, or constraints... e.g. 'MC must start in prison', 'inspired by Solo Leveling but in ancient China'"
            className="w-full h-24 bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-crimson-500/50 resize-none transition-colors" />
        </div>

        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>}

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl font-display tracking-widest text-base flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white", boxShadow: "0 8px 32px rgba(255,77,109,0.25)" }}>
          <Sparkles size={18} /> GENERATE SERIES BIBLE
        </motion.button>

        <p className="text-ink-600 text-[10px] text-center">Tip: lock specific fields to keep them on reroll. Press G anywhere to open the engine.</p>
      </div>
    </div>
  );

  // ── Step 1: Generating ──────────────────────────────────────────
  if (step === 1) return (
    <div className="p-6 md:p-8 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm w-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", boxShadow: "0 0 40px rgba(255,77,109,0.4)" }}>
          <Sparkles size={24} className="text-white" />
        </motion.div>

        <h2 className="font-display text-2xl tracking-widest text-white mb-2">BUILDING YOUR BIBLE</h2>
        <p className="text-ink-400 text-sm mb-8">Cross-referencing {19} series from your library...</p>

        <div className="space-y-2 text-left">
          {GEN_STAGES.map((stage, i) => {
            const isDone = i < genStage;
            const isActive = i === genStage;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= genStage ? 1 : 0.2, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 py-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDone ? "rgba(16,185,129,0.15)" : isActive ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isDone ? "#10b981" : isActive ? "#ff4d6d" : "rgba(255,255,255,0.08)"}`,
                  }}>
                  {isDone ? (
                    <span className="text-green-400 text-[9px] font-bold">✓</span>
                  ) : isActive ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Loader size={10} className="text-crimson-400" />
                    </motion.div>
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-ink-600" />
                  )}
                </div>
                <span className="text-xs" style={{ color: isDone ? "#10b981" : isActive ? "#fff" : "#333" }}>
                  {stage}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  // ── Step 2: Result ──────────────────────────────────────────────
  if (step === 2 && bible) {
    const hooks = Array.isArray(bible.virality_hooks) ? bible.virality_hooks : [];
    const themes = Array.isArray(bible.core_themes) ? bible.core_themes : [];
    const arcs = Array.isArray(bible.chapter_arc_structure) ? bible.chapter_arc_structure : [];
    const chapters = Array.isArray(bible.first_10_chapters) ? bible.first_10_chapters : [];
    const comparables = Array.isArray(bible.comparable_series) ? bible.comparable_series : [];
    const cast = Array.isArray(bible.supporting_cast) ? bible.supporting_cast : [];

    return (
      <div className="p-6 md:p-8 min-h-screen">
        <ProgressSteps steps={STEPS} current={2} />

        {/* Title block */}
        <div className="bg-ink-800/60 border border-crimson-500/20 rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl tracking-widest text-white mb-1">{bible.series_title}</h2>
              <p className="text-crimson-400 text-base italic mb-3">"{bible.tagline}"</p>
              <p className="text-ink-200 text-sm leading-relaxed max-w-2xl">{bible.elevator_pitch}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {themes.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-ink-300 border border-white/10">{t}</span>
                ))}
                {comparables.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full text-[10px] bg-crimson-500/10 text-crimson-400 border border-crimson-500/20">{c}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={handleSave} disabled={saving || saved}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                style={{ background: saved ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #ff4d6d, #c0392b)", color: saved ? "#10b981" : "white", border: saved ? "1px solid rgba(16,185,129,0.3)" : "none" }}>
                {saving ? <><Loader size={13} className="animate-spin" />Saving...</> : saved ? <><CheckCircle size={13} />Saved!</> : <><Save size={13} />Save Bible</>}
              </button>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white transition-all border border-white/10">
                {copied ? <><Check size={13} className="text-green-400" />Copied!</> : <><Copy size={13} />Copy</>}
              </button>
              <button onClick={() => { setStep(0); setBible(null); setSaved(false); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all border border-white/5">
                <RefreshCw size={12} /> New Bible
              </button>
            </div>
          </div>
        </div>

        {/* Virality score */}
        {bible.virality_score && (
          <div className="mb-4">
            <VitalityMeter score={bible.virality_score} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* World */}
          <BibleSection title={`WORLD: ${bible.world_name}`} icon={<Globe size={14} className="text-cyan-400" />}>
            <p className="text-ink-200 text-sm leading-relaxed mb-3">{bible.world_building}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-ink-500">Setting</span>
              <button onClick={() => handleReroll("world")} disabled={rerolling === "world"}
                className="flex items-center gap-1 text-[10px] text-ink-500 hover:text-crimson-400 transition-colors">
                {rerolling === "world" ? <Loader size={10} className="animate-spin" /> : <RotateCw size={10} />} Reroll
              </button>
            </div>
          </BibleSection>

          {/* Power system */}
          <BibleSection title={`POWER: ${bible.power_system_name}`} icon={<Zap size={14} className="text-yellow-400" />}>
            <p className="text-ink-200 text-sm leading-relaxed mb-3">{bible.power_system}</p>
            <div className="flex justify-end">
              <button onClick={() => handleReroll("power_system")} disabled={rerolling === "power_system"}
                className="flex items-center gap-1 text-[10px] text-ink-500 hover:text-crimson-400 transition-colors">
                {rerolling === "power_system" ? <Loader size={10} className="animate-spin" /> : <RotateCw size={10} />} Reroll
              </button>
            </div>
          </BibleSection>

          {/* Protagonist */}
          <BibleSection title={`PROTAGONIST: ${bible.protagonist_name}`} icon={<User size={14} className="text-green-400" />}>
            <p className="text-crimson-400 text-xs font-semibold mb-1">{bible.protagonist_archetype}</p>
            <p className="text-ink-200 text-sm leading-relaxed mb-3">{bible.protagonist_background}</p>
            <div className="flex justify-end">
              <button onClick={() => handleReroll("protagonist")} disabled={rerolling === "protagonist"}
                className="flex items-center gap-1 text-[10px] text-ink-500 hover:text-crimson-400 transition-colors">
                {rerolling === "protagonist" ? <Loader size={10} className="animate-spin" /> : <RotateCw size={10} />} Reroll
              </button>
            </div>
          </BibleSection>

          {/* Antagonist */}
          <BibleSection title={`ANTAGONIST: ${bible.antagonist_name}`} icon={<Sword size={14} className="text-red-400" />}>
            <p className="text-crimson-400 text-xs font-semibold mb-1">{bible.antagonist_archetype}</p>
            <p className="text-ink-200 text-sm leading-relaxed mb-3">{bible.antagonist_motivation}</p>
            <div className="flex justify-end">
              <button onClick={() => handleReroll("antagonist")} disabled={rerolling === "antagonist"}
                className="flex items-center gap-1 text-[10px] text-ink-500 hover:text-crimson-400 transition-colors">
                {rerolling === "antagonist" ? <Loader size={10} className="animate-spin" /> : <RotateCw size={10} />} Reroll
              </button>
            </div>
          </BibleSection>
        </div>

        {/* Virality hooks */}
        {hooks.length > 0 && (
          <BibleSection title="VIRALITY HOOKS" icon={<TrendingUp size={14} className="text-pink-400" />}>
            <div className="space-y-2">
              {hooks.map((h: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-display text-xl text-crimson-400/30 leading-none w-5 flex-shrink-0">{i + 1}</span>
                  <p className="text-ink-200 text-sm leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </BibleSection>
        )}

        {/* Supporting cast */}
        {cast.length > 0 && (
          <BibleSection title="SUPPORTING CAST" icon={<Users size={14} className="text-purple-400" />} defaultOpen={false}>
            <div className="space-y-3">
              {cast.map((c: any, i: number) => (
                <div key={i} className="border-l-2 border-purple-500/20 pl-3">
                  <p className="text-white text-sm font-semibold">{c.name} <span className="text-ink-500 text-xs font-normal">— {c.role}</span></p>
                  <p className="text-ink-400 text-xs mt-0.5">{c.description}</p>
                </div>
              ))}
            </div>
          </BibleSection>
        )}

        {/* Story arcs */}
        {arcs.length > 0 && (
          <BibleSection title="STORY ARCS" icon={<BookOpen size={14} className="text-blue-400" />} defaultOpen={false}>
            <div className="space-y-3">
              {arcs.map((arc: any, i: number) => {
                const colors = ["#ff4d6d","#ffd700","#a855f7","#00d4ff","#10b981"];
                const color = colors[i % colors.length];
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: color, minHeight: 12 }} />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-sm font-semibold">{arc.arc_name}</span>
                        <span className="text-ink-500 text-[10px]">Ch. {arc.chapters}</span>
                      </div>
                      <p className="text-ink-400 text-xs leading-relaxed">{arc.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </BibleSection>
        )}

        {/* First 10 chapters */}
        {chapters.length > 0 && (
          <BibleSection title="FIRST 10 CHAPTERS" icon={<FileText size={14} className="text-orange-400" />} defaultOpen={false}>
            <div className="space-y-2">
              {chapters.map((ch: any) => (
                <div key={ch.chapter} className="flex items-center gap-3 p-2.5 rounded-xl bg-ink-700/50 border border-white/5">
                  <span className="font-display text-2xl text-crimson-400/25 w-7 text-center leading-none flex-shrink-0">{ch.chapter}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{ch.title}</p>
                    <p className="text-ink-500 text-[10px] italic truncate">↳ {ch.hook}</p>
                  </div>
                </div>
              ))}
            </div>
          </BibleSection>
        )}

        {/* Originality */}
        {bible.what_makes_it_original && (
          <BibleSection title="WHAT MAKES IT ORIGINAL" icon={<Star size={14} className="text-yellow-400" />} defaultOpen={false}>
            <p className="text-ink-200 text-sm leading-relaxed">{bible.what_makes_it_original}</p>
          </BibleSection>
        )}
      </div>
    );
  }

  return null;
}
