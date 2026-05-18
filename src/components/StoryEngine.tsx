"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ChevronRight, RotateCw, Copy, Check, BookOpen } from "lucide-react";

const genres = ["Shonen Action", "Dark Fantasy", "Isekai", "Psychological", "Sci-Fi", "Romance Action", "Historical", "Horror Survival"];
const protagonists = ["Weakest to Strongest", "Genius Tactician", "Anti-Hero", "Underdog Chosen One", "Revenge Arc", "Overpowered Hidden", "Reluctant Hero"];
const settings = ["Modern World + Portals", "Medieval Fantasy", "Dystopian Future", "Ancient Mythology", "Space Opera", "Cultivation World", "Urban Supernatural"];
const tones = ["Dark & Gritty", "Epic & Grand", "Psychological Thriller", "Comedic Undertones", "Pure Action", "Emotional Drama"];
const powerTypes = ["RPG System", "Martial Arts Tiers", "Devil Fruits Style", "Magic Schools", "Ancient Bloodlines", "Technology + Power", "Forbidden Arts"];

const exampleBible = `# SERIES TITLE: "VOID SOVEREIGN"

## 🌍 WORLD CONCEPT
In a world where reality is made of layered dimensions called "Strata", 
certain humans awaken as "Rifters" — beings who can tear through the fabric 
between layers. The lowest Stratum is humanity's home. The highest is ruled 
by an immortal empire of beings called the Sovereign Class.

## 👤 PROTAGONIST
**Name:** Kael Dusk  
**Archetype:** Weakest to Strongest / Hidden Potential  
**Origin:** Born without the Rifter gene — or so everyone thought.  
**Core Drive:** Prove the system wrong. Destroy the ceiling.

## ⚡ POWER SYSTEM
**Void Fracture System**  
- Rifters are ranked F through S based on fracture size  
- Kael's fractures are invisible — registering as zero  
- In reality: his fractures open into an unmapped 10th Stratum  
- Abilities scale with depth, not width — unique vertical power

## 😈 PRIMARY ANTAGONIST
**The Sovereign Council** — Ancient beings who secretly cap human evolution  
to maintain their dominance. They don't fight heroes. They erase them from history.

## 📈 STORY ARCS (First 50 Chapters)
1. **Zero Fracture** (Ch.1-8) — Kael fails the awakening test publicly  
2. **First Breach** (Ch.9-18) — Discovers the 10th Stratum alone  
3. **Hidden Cultivation** (Ch.19-30) — Trains in secret, starts shocking peers  
4. **The Tournament** (Ch.31-42) — Forces a confrontation with the system  
5. **First Sovereign Contact** (Ch.43-50) — They notice him. Game changes.

## 🔥 VIRALITY HOOKS
- The "zero reading" twist reveal
- Hidden stratum discovery sequence  
- First time he uses full power publicly
- Sovereign's reaction when they can't find him in their records`;

export default function StoryEngine() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    genre: "", protagonist: "", setting: "", tone: "", power: "",
    references: [] as string[], custom: ""
  });
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleGenerate = () => {
    setGenerating(true);
    setOutput("");
    let i = 0;
    const chars = exampleBible.split("");
    const interval = setInterval(() => {
      setOutput(prev => prev + chars[i]);
      i++;
      if (i >= chars.length) {
        clearInterval(interval);
        setGenerating(false);
      }
    }, 8);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = ["Genre & Tone", "Characters", "World & Power", "Generate"];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-gradient-red">STORY ENGINE</h1>
          <p className="text-ink-300 text-sm mt-1">Configure. Generate. Build your empire.</p>
        </div>
        <span className="badge-pill bg-crimson-600/20 text-crimson-400 border border-crimson-600/30 animate-pulse">
          🔴 AI ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Config Panel */}
        <div className="space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
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
                <Section label="Reference Inspiration (optional)">
                  {["One Piece", "Solo Leveling", "Attack on Titan", "Demon Slayer", "Naruto", "Tower of God"].map(r => (
                    <Chip key={r} label={r} active={config.references.includes(r)} color="#00d4ff" onClick={() => toggle("references", r)} />
                  ))}
                </Section>
                <div className="mt-4">
                  <label className="text-xs text-ink-300 uppercase tracking-wider font-semibold">Custom Notes</label>
                  <textarea
                    value={config.custom}
                    onChange={e => setConfig(c => ({ ...c, custom: e.target.value }))}
                    placeholder="Any specific ideas, constraints, or directions..."
                    rows={3}
                    className="mt-2 w-full bg-ink-600 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-ink-400 focus:outline-none focus:border-crimson-500 resize-none"
                  />
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
            {step < 3 ? (
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
                {generating ? "Generating..." : "Generate Story Bible"}
              </button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="rounded-xl bg-ink-900 border border-white/5 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-ink-800">
            <div className="flex items-center gap-2 text-xs text-ink-300 font-mono">
              <BookOpen size={14} />
              story_bible_output.md
            </div>
            {output && (
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-ink-300 hover:text-white transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <div className="flex-1 p-4 font-mono text-xs text-green-300 overflow-y-auto min-h-96 max-h-[600px] whitespace-pre-wrap">
            {output || (
              <div className="flex flex-col items-center justify-center h-full text-ink-500 gap-3">
                <Zap size={32} className="text-ink-600" />
                <span>Configure your story and hit Generate</span>
              </div>
            )}
            {generating && <span className="animate-pulse">▋</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-ink-300 uppercase tracking-wider font-semibold mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full border transition-all"
      style={active
        ? { backgroundColor: `${color}20`, color, borderColor: `${color}60` }
        : { backgroundColor: "transparent", color: "#707070", borderColor: "rgba(255,255,255,0.1)" }
      }
    >
      {label}
    </button>
  );
}
