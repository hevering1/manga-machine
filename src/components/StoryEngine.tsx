"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, ChevronRight, RotateCw, Copy, Check, BookOpen,
  Globe, Sword, User, Users, Flame, Star, ChevronDown, Save,
  FileText, RefreshCw, CheckCircle, Loader, X, Download
} from "lucide-react";

const genres = ["Shonen Action","Dark Fantasy","Isekai","Psychological","Sci-Fi","Romance Action","Historical","Horror Survival","Cultivation","Political"];
const protagonists = ["Weakest to Strongest","Genius Tactician","Anti-Hero","Hidden Genius / Underdog","Revenge Arc","Overpowered Hidden","Reluctant Hero","Fallen King Reborn","Nation Builder"];
const settings = ["Modern World + Dungeons","Medieval Fantasy","Dystopian Future","Ancient Cultivation World","Tower / Trial System","Urban Supernatural","Multi-Nation Epic","Post-Apocalyptic"];
const tones = ["Dark & Gritty","Epic & Grand","Psychological Thriller","Pure Revenge","Optimistic Power Fantasy","Emotional Drama","Cold & Methodical"];
const powerTypes = ["Skill Evolution System","Cultivation Tiers","Tower Floor System","Absorption / Predator Style","Divine / Zodiac System","Martial Arts Paths","Forbidden Ancient Arts","Clone / Replication"];

interface ReferenceEntry { id: string; title: string; type: string; }
interface StoryResult {
  series_title: string; tagline: string; elevator_pitch: string;
  world_name: string; world_building: string;
  power_system_name: string; power_system: string;
  protagonist_name: string; protagonist_background: string; protagonist_archetype: string;
  antagonist_name: string; antagonist_motivation: string; antagonist_archetype: string;
  supporting_cast: { name: string; role: string; description: string }[];
  core_themes: string[]; tone: string; virality_hooks: string[];
  chapter_arc_structure: { arc_name: string; chapters: string; summary: string }[];
  first_10_chapters: { chapter: number; title: string; summary: string; hook: string }[];
  what_makes_it_original: string; target_audience: string; comparable_series: string[];
  bible_id?: string;
}

function Chip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
      style={{ borderColor: active ? color : "rgba(255,255,255,0.1)", backgroundColor: active ? `${color}22` : "transparent", color: active ? color : "#888" }}>
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

function RerollButton({ section, onReroll, rerolling }: { section: string; onReroll: (s: string) => void; rerolling: string | null }) {
  const isLoading = rerolling === section;
  return (
    <button
      onClick={() => onReroll(section)}
      disabled={!!rerolling}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
      style={{ backgroundColor: isLoading ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)", color: isLoading ? "#ffd700" : "#666" }}
      title="Reroll this section"
    >
      {isLoading ? <Loader size={10} className="animate-spin" /> : <RefreshCw size={10} />}
      {isLoading ? "Rerolling..." : "Reroll"}
    </button>
  );
}

function ResultSection({ icon, title, children, section, onReroll, rerolling }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
  section?: string; onReroll?: (s: string) => void; rerolling?: string | null;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-3">
      <div className="flex items-center bg-ink-800">
        <button onClick={() => setOpen(o => !o)}
          className="flex-1 flex items-center gap-2 px-4 py-3 hover:bg-ink-700 transition-colors text-left">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">{icon} {title}</span>
          <ChevronDown size={14} className={`text-ink-400 transition-transform ml-auto ${open ? "rotate-180" : ""}`} />
        </button>
        {section && onReroll && (
          <div className="pr-3">
            <RerollButton section={section} onReroll={onReroll} rerolling={rerolling ?? null} />
          </div>
        )}
      </div>
      {open && <div className="px-4 py-3 bg-ink-900 text-sm text-ink-100 leading-relaxed">{children}</div>}
    </div>
  );
}

function ChapterScriptModal({ story, chapter, onClose }: { story: StoryResult; chapter: number; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [script, setScript] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/chapter-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story, chapter, saveToVault: !!story.bible_id }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setScript(d.result);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const chapterData = story.first_10_chapters?.find(c => c.chapter === chapter);

  const handleCopy = () => {
    if (script?.script) {
      navigator.clipboard.writeText(script.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-crimson-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <FileText size={12} /> Chapter Script
            </div>
            <h2 className="font-display text-xl tracking-wider text-white">
              CH.{chapter} — {chapterData?.title || `Chapter ${chapter}`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {script && (
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white transition-all">
                {copied ? <><Check size={12} className="text-green-400" /> Copied!</> : <><Copy size={12} /> Copy Script</>}
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Sparkles size={24} className="text-crimson-400" />
              </motion.div>
              <p className="text-ink-300 text-sm">Writing chapter script...</p>
            </div>
          )}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-4">{error}</div>
          )}
          {script && (
            <div className="space-y-4">
              <div className="flex gap-4 text-xs text-ink-400 font-mono">
                <span>{script.scene_count} scenes</span>
                <span>·</span>
                <span>{script.panel_count} panels</span>
                {script.arc_name && <><span>·</span><span>{script.arc_name}</span></>}
              </div>
              <pre className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap font-mono bg-ink-900 rounded-xl p-4 border border-white/5 overflow-x-auto">
                {script.script}
              </pre>
              {script.panel_notes && (
                <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4">
                  <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-2">Key Visual Moments</p>
                  <p className="text-ink-200 text-xs leading-relaxed">{script.panel_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function StoryEngine() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({ genre: "", protagonist: "", setting: "", tone: "", power: "", referenceIds: [] as string[], themes: "" });
  const [references, setReferences] = useState<ReferenceEntry[]>([]);
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [rerolling, setRerolling] = useState<string | null>(null);
  const [scriptModal, setScriptModal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/references")
      .then(r => r.json())
      .then(data => setReferences(data.references || []))
      .catch(() => {});
  }, []);

  const toggle = (key: keyof typeof config, val: string) => {
    if (key === "referenceIds") {
      const refs = config.referenceIds;
      setConfig(c => ({ ...c, referenceIds: refs.includes(val) ? refs.filter(r => r !== val) : [...refs, val] }));
    } else {
      setConfig(c => ({ ...c, [key]: (c[key] as string) === val ? "" : val }));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setStory(null);
    setError("");
    setSaved(false);
    setSaveError("");
    try {
      const res = await fetch("/api/story-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone: config.tone, genre: config.genre, themes: config.themes,
          powerSystemStyle: config.power, protagonistType: config.protagonist,
          worldScale: config.setting, referenceIds: config.referenceIds,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setStory(data.story);
      setActiveTab("overview");
      setStep(1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!story) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/save-bible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, config }),
      });
      const data = await res.json();
      if (data.error) { setSaveError(data.error); return; }
      setStory(s => s ? { ...s, bible_id: data.id } : s);
      setSaved(true);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReroll = async (section: string) => {
    if (!story || rerolling) return;
    setRerolling(section);
    try {
      const res = await fetch("/api/reroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, section }),
      });
      const data = await res.json();
      if (data.error) return;
      setStory(s => s ? { ...s, ...data.data } : s);
      setSaved(false); // Mark as unsaved after reroll
    } catch {}
    finally { setRerolling(null); }
  };

  const handleCopy = () => {
    if (!story) return;
    const text = `
# ${story.series_title}
${story.tagline}

## ELEVATOR PITCH
${story.elevator_pitch}

## WORLD: ${story.world_name}
${story.world_building}

## POWER SYSTEM: ${story.power_system_name}
${story.power_system}

## PROTAGONIST: ${story.protagonist_name} (${story.protagonist_archetype})
${story.protagonist_background}

## ANTAGONIST: ${story.antagonist_name} (${story.antagonist_archetype})
${story.antagonist_motivation}

## SUPPORTING CAST
${story.supporting_cast?.map(c => `- ${c.name} (${c.role}): ${c.description}`).join("\n")}

## CORE THEMES
${story.core_themes?.join(", ")}

## VIRALITY HOOKS
${story.virality_hooks?.map((h, i) => `${i + 1}. ${h}`).join("\n")}

## STORY ARCS
${story.chapter_arc_structure?.map(a => `### ${a.arc_name} (Ch. ${a.chapters})\n${a.summary}`).join("\n\n")}

## FIRST 10 CHAPTERS
${story.first_10_chapters?.map(c => `Ch.${c.chapter}: ${c.title}\n${c.summary}\nHook: ${c.hook}`).join("\n\n")}

## WHAT MAKES IT ORIGINAL
${story.what_makes_it_original}

## TARGET AUDIENCE
${story.target_audience}

## COMPARABLE SERIES
${story.comparable_series?.join(", ")}
`.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Star size={12} /> },
    { id: "world", label: "World", icon: <Globe size={12} /> },
    { id: "characters", label: "Characters", icon: <Users size={12} /> },
    { id: "power", label: "Power System", icon: <Zap size={12} /> },
    { id: "arcs", label: "Story Arcs", icon: <BookOpen size={12} /> },
    { id: "chapters", label: "Chapter Scripts", icon: <FileText size={12} /> },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="text-crimson-400" size={20} />
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">STORY ENGINE</h1>
        </div>
        <p className="text-ink-300 text-sm">Generate original series bibles from your reference library.</p>
      </div>

      {/* Config Panel */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-ink-800/60 border border-white/10 rounded-2xl p-6 max-w-4xl">
          <Section label="Genre">
            {genres.map(g => <Chip key={g} label={g} active={config.genre === g} color="#ff4d6d" onClick={() => toggle("genre", g)} />)}
          </Section>
          <Section label="Protagonist Archetype">
            {protagonists.map(p => <Chip key={p} label={p} active={config.protagonist === p} color="#ffd700" onClick={() => toggle("protagonist", p)} />)}
          </Section>
          <Section label="World Setting">
            {settings.map(s => <Chip key={s} label={s} active={config.setting === s} color="#00d4ff" onClick={() => toggle("setting", s)} />)}
          </Section>
          <Section label="Tone">
            {tones.map(t => <Chip key={t} label={t} active={config.tone === t} color="#a855f7" onClick={() => toggle("tone", t)} />)}
          </Section>
          <Section label="Power System Style">
            {powerTypes.map(p => <Chip key={p} label={p} active={config.power === p} color="#10b981" onClick={() => toggle("power", p)} />)}
          </Section>
          <div className="mb-5">
            <p className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-2">Custom Themes (optional)</p>
            <input
              type="text"
              value={config.themes}
              onChange={e => setConfig(c => ({ ...c, themes: e.target.value }))}
              placeholder="e.g. betrayal, identity, found family..."
              className="w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-ink-400 focus:outline-none focus:border-crimson-500/50"
            />
          </div>
          {references.length > 0 && (
            <Section label={`Reference Library (${config.referenceIds.length} selected)`}>
              {references.map(r => (
                <Chip key={r.id} label={r.title} active={config.referenceIds.includes(r.id)} color="#ff8c00"
                  onClick={() => toggle("referenceIds", r.id)} />
              ))}
            </Section>
          )}
          <motion.button
            onClick={handleGenerate}
            disabled={generating}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-4 rounded-xl font-display tracking-widest text-lg flex items-center justify-center gap-3 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            {generating ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Zap size={18} /></motion.div>GENERATING SERIES BIBLE...</>
            ) : (
              <><Sparkles size={18} />GENERATE SERIES BIBLE<ChevronRight size={18} /></>
            )}
          </motion.button>
          {error && <div className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
        </motion.div>
      )}

      {/* Results Panel */}
      {step === 1 && story && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
          {/* Title Bar */}
          <div className="bg-ink-800/80 border border-white/10 rounded-2xl p-5 mb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-2xl md:text-3xl tracking-widest text-white mb-1">{story.series_title}</h2>
                <p className="text-crimson-400 text-sm font-medium italic mb-2">{story.tagline}</p>
                <p className="text-ink-200 text-sm leading-relaxed">{story.elevator_pitch}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {story.core_themes?.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "rgba(255,77,109,0.15)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.3)" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                {saved ? (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20">
                    <CheckCircle size={12} /> Saved
                  </div>
                ) : (
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ backgroundColor: "rgba(255,215,0,0.15)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.3)" }}>
                    {saving ? <><Loader size={12} className="animate-spin" />Saving...</> : <><Save size={12} />Save Bible</>}
                  </button>
                )}
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: copied ? "#10b981" : "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy All</>}
                </button>
                <button onClick={() => { setStep(0); setStory(null); setSaved(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <RefreshCw size={12} />New Bible
                </button>
              </div>
            </div>
            {saveError && <div className="mt-2 text-red-400 text-xs">{saveError}</div>}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? "rgba(255,77,109,0.2)" : "rgba(255,255,255,0.03)",
                  color: activeTab === tab.id ? "#ff4d6d" : "#666",
                  border: `1px solid ${activeTab === tab.id ? "rgba(255,77,109,0.4)" : "rgba(255,255,255,0.05)"}`,
                }}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

              {activeTab === "overview" && (
                <div>
                  <ResultSection icon={<Flame size={14} className="text-crimson-400" />} title="What Makes It Original" section="overview" onReroll={handleReroll} rerolling={rerolling}>
                    <p>{story.what_makes_it_original}</p>
                    <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-4 text-xs text-ink-400">
                      <span><span className="text-ink-300 font-semibold">Audience:</span> {story.target_audience}</span>
                      <span><span className="text-ink-300 font-semibold">Tone:</span> {story.tone}</span>
                      <span><span className="text-ink-300 font-semibold">Comparable:</span> {story.comparable_series?.join(", ")}</span>
                    </div>
                  </ResultSection>
                  <ResultSection icon={<Star size={14} className="text-yellow-400" />} title="Virality Hooks" section="virality_hooks" onReroll={handleReroll} rerolling={rerolling}>
                    <div className="space-y-2">
                      {story.virality_hooks?.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-crimson-400 font-display text-lg leading-none mt-0.5">{i + 1}</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                </div>
              )}

              {activeTab === "world" && (
                <ResultSection icon={<Globe size={14} className="text-blue-400" />} title={`World: ${story.world_name}`} section="world" onReroll={handleReroll} rerolling={rerolling}>
                  <p>{story.world_building}</p>
                </ResultSection>
              )}

              {activeTab === "characters" && (
                <div>
                  <ResultSection icon={<User size={14} className="text-green-400" />} title={`Protagonist: ${story.protagonist_name}`} section="protagonist" onReroll={handleReroll} rerolling={rerolling}>
                    <div className="mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full mr-2" style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>{story.protagonist_archetype}</span>
                    </div>
                    <p>{story.protagonist_background}</p>
                  </ResultSection>
                  <ResultSection icon={<Sword size={14} className="text-red-400" />} title={`Antagonist: ${story.antagonist_name}`} section="antagonist" onReroll={handleReroll} rerolling={rerolling}>
                    <div className="mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full mr-2" style={{ backgroundColor: "rgba(255,77,109,0.15)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.3)" }}>{story.antagonist_archetype}</span>
                    </div>
                    <p>{story.antagonist_motivation}</p>
                  </ResultSection>
                  <ResultSection icon={<Users size={14} className="text-purple-400" />} title="Supporting Cast" section="supporting_cast" onReroll={handleReroll} rerolling={rerolling}>
                    <div className="space-y-3">
                      {story.supporting_cast?.map((c, i) => (
                        <div key={i} className="border-l-2 border-purple-500/30 pl-3">
                          <div className="text-white font-semibold text-sm">{c.name} <span className="text-purple-400 font-normal text-xs">— {c.role}</span></div>
                          <div className="text-ink-300 text-xs mt-0.5">{c.description}</div>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                </div>
              )}

              {activeTab === "power" && (
                <ResultSection icon={<Zap size={14} className="text-yellow-400" />} title={`Power System: ${story.power_system_name}`} section="power_system" onReroll={handleReroll} rerolling={rerolling}>
                  <p>{story.power_system}</p>
                </ResultSection>
              )}

              {activeTab === "arcs" && (
                <div>
                  <ResultSection icon={<BookOpen size={14} className="text-orange-400" />} title="Story Arc Structure" section="arc_structure" onReroll={handleReroll} rerolling={rerolling}>
                    <div className="space-y-4">
                      {story.chapter_arc_structure?.map((arc, i) => (
                        <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: ["#ff4d6d","#ffd700","#a855f7","#00d4ff","#10b981"][i % 5] }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-display text-base tracking-wider text-white">{arc.arc_name}</span>
                            <span className="text-xs text-ink-400 font-mono">Ch. {arc.chapters}</span>
                          </div>
                          <p className="text-ink-300 text-sm">{arc.summary}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                </div>
              )}

              {activeTab === "chapters" && (
                <div>
                  <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-300 flex items-center gap-2">
                    <FileText size={12} />
                    Click any chapter to generate a full script with panel breakdowns and dialogue.
                    {!story.bible_id && <span className="text-yellow-400 font-semibold">Save the bible first to auto-archive scripts to Chapter Vault.</span>}
                  </div>
                  <ResultSection icon={<FileText size={14} className="text-cyan-400" />} title="First 10 Chapters" section="first_chapters" onReroll={handleReroll} rerolling={rerolling}>
                    <div className="space-y-3">
                      {story.first_10_chapters?.map((ch) => (
                        <motion.div key={ch.chapter}
                          whileHover={{ x: 4 }}
                          className="group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                          onClick={() => setScriptModal(ch.chapter)}>
                          <div className="font-display text-2xl text-crimson-400/40 leading-none font-bold w-8 flex-shrink-0 group-hover:text-crimson-400 transition-colors">
                            {ch.chapter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-semibold mb-0.5 group-hover:text-crimson-300 transition-colors">{ch.title}</div>
                            <div className="text-ink-400 text-xs leading-relaxed mb-1">{ch.summary}</div>
                            <div className="text-crimson-400/70 text-[11px] italic">↳ {ch.hook}</div>
                          </div>
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-1 text-[10px] text-crimson-400 font-semibold px-2 py-1 rounded-lg bg-crimson-400/10 border border-crimson-400/20">
                              <FileText size={9} />Write Script
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ResultSection>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Chapter Script Modal */}
      {scriptModal !== null && story && (
        <ChapterScriptModal story={story} chapter={scriptModal} onClose={() => setScriptModal(null)} />
      )}
    </div>
  );
}
