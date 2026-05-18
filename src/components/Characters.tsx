"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, User, Zap, Heart, Sword, Shield, RefreshCw,
  Sparkles, X, Loader, ImageIcon, Star, Globe, Users,
  ChevronRight, Copy, Check
} from "lucide-react";

interface Character {
  name: string;
  role: string;
  archetype: string;
  background: string;
  motivation: string;
  power: string;
  weakness: string;
  relationship: string;
  portrait?: string;
  series?: string;
}

const archetypes = [
  { name: "The Zero", desc: "Starts powerless, becomes unstoppable", color: "#ff4d6d", icon: "⚡" },
  { name: "The Prodigy", desc: "Born gifted, refines their edge", color: "#ffd700", icon: "✦" },
  { name: "The Fallen King", desc: "Once great, clawing back to the top", color: "#a855f7", icon: "♛" },
  { name: "The Avenger", desc: "Forged by loss, driven by vengeance", color: "#e85d04", icon: "🔥" },
  { name: "The Schemer", desc: "Brain beats brawn — always ten moves ahead", color: "#00d4ff", icon: "♟" },
  { name: "The Wild Card", desc: "Unpredictable. No rules. Pure instinct.", color: "#10b981", icon: "🃏" },
  { name: "The Vessel", desc: "Carries something ancient and dangerous inside", color: "#ec4899", icon: "◈" },
  { name: "The Mentor's Shadow", desc: "Defined by who trained them — or killed them", color: "#f59e0b", icon: "⚔" },
];

function CharacterCard({ char, onSelect }: { char: Character; onSelect: (c: Character) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(char)}
      className="bg-ink-800/60 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-all group">
      {/* Portrait */}
      <div className="relative aspect-square overflow-hidden bg-ink-700">
        {char.portrait ? (
          <img src={char.portrait} alt={char.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={32} className="text-ink-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-display text-lg tracking-wider text-white leading-tight">{char.name}</p>
          <p className="text-ink-400 text-[10px]">{char.role}</p>
        </div>
      </div>
      <div className="p-3">
        {char.archetype && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: "rgba(255,77,109,0.1)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}>
            {char.archetype}
          </span>
        )}
        {char.power && (
          <p className="text-ink-400 text-xs mt-2 line-clamp-2 leading-relaxed">{char.power}</p>
        )}
      </div>
    </motion.div>
  );
}

function CharacterDetailModal({ char, onClose, onRegenPortrait }: {
  char: Character;
  onClose: () => void;
  onRegenPortrait: (c: Character) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${char.name} (${char.role})\nArchetype: ${char.archetype}\nBackground: ${char.background}\nMotivation: ${char.motivation}\nPower: ${char.power}\nWeakness: ${char.weakness}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Portrait header */}
        <div className="relative h-64 overflow-hidden">
          {char.portrait ? (
            <img src={char.portrait} alt={char.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-ink-700">
              <User size={48} className="text-ink-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => onRegenPortrait(char)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all">
              <RefreshCw size={10} /> Regenerate
            </button>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all">
              {copied ? <><Check size={10} className="text-green-400" />Copied</> : <><Copy size={10} />Copy</>}
            </button>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all">
              <X size={13} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-display text-2xl tracking-wider text-white">{char.name}</p>
            <p className="text-ink-300 text-sm">{char.role}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {char.archetype && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(255,77,109,0.12)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}>
              {char.archetype}
            </span>
          )}
          {[
            { label: "Background", val: char.background, icon: <User size={12} className="text-blue-400" /> },
            { label: "Motivation", val: char.motivation, icon: <Heart size={12} className="text-red-400" /> },
            { label: "Power / Ability", val: char.power, icon: <Zap size={12} className="text-yellow-400" /> },
            { label: "Weakness", val: char.weakness, icon: <Shield size={12} className="text-orange-400" /> },
            { label: "Key Relationship", val: char.relationship, icon: <Users size={12} className="text-purple-400" /> },
          ].filter(f => f.val).map(f => (
            <div key={f.label}>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">
                {f.icon} {f.label}
              </div>
              <p className="text-ink-100 text-sm leading-relaxed">{f.val}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GenerateModal({ onClose, onGenerated }: {
  onClose: () => void;
  onGenerated: (chars: Character[]) => void;
}) {
  const [seriesContext, setSeriesContext] = useState("");
  const [count, setCount] = useState(3);
  const [includePortraits, setIncludePortraits] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  const [bibles, setBibles] = useState<{ id: string; series_title: string; protagonist_name: string; antagonist_name: string; supporting_cast: string; }[]>([]);
  const [selectedBible, setSelectedBible] = useState("");

  useEffect(() => {
    fetch("/api/bibles").then(r => r.json()).then(d => setBibles(d.bibles || []));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setStage("Generating characters...");
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesContext, bibleId: selectedBible, count, includePortraits }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setStage("");
      onGenerated(data.characters);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-lg tracking-wider text-white">Generate Characters</h3>
            <p className="text-ink-400 text-xs mt-0.5">AI creates full profiles + portrait art</p>
          </div>
          <button onClick={onClose} disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-ink-400 transition-all">
            <X size={13} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {bibles.length > 0 && (
            <div>
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">From Bible (optional)</label>
              <select value={selectedBible} onChange={e => setSelectedBible(e.target.value)}
                className="w-full bg-ink-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-crimson-500/50">
                <option value="">— None, use custom context —</option>
                {bibles.map(b => <option key={b.id} value={b.id}>{b.series_title}</option>)}
              </select>
            </div>
          )}
          {!selectedBible && (
            <div>
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">Series Context</label>
              <textarea value={seriesContext} onChange={e => setSeriesContext(e.target.value)}
                placeholder="Describe your series world, tone, power system... The more detail the better."
                className="w-full h-28 bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-crimson-500/50 resize-none" />
            </div>
          )}
          <div>
            <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">Characters to Generate: {count}</label>
            <input type="range" min={1} max={6} value={count} onChange={e => setCount(Number(e.target.value))}
              className="w-full accent-crimson-500" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIncludePortraits(!includePortraits)}
              className="w-5 h-5 rounded flex items-center justify-center transition-all flex-shrink-0"
              style={{ backgroundColor: includePortraits ? "rgba(255,77,109,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${includePortraits ? "#ff4d6d" : "rgba(255,255,255,0.1)"}` }}>
              {includePortraits && <Check size={10} className="text-crimson-400" />}
            </button>
            <span className="text-sm text-ink-200">Generate AI portrait for each character</span>
          </div>
          {error && <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          {stage && <p className="text-ink-400 text-xs text-center animate-pulse">{stage}</p>}
          <button onClick={handleGenerate} disabled={loading || (!seriesContext.trim() && !selectedBible)}
            className="w-full py-3 rounded-xl font-display tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            {loading ? <><Loader size={14} className="animate-spin" />Generating...</> : <><Sparkles size={14} />Generate {count} Character{count > 1 ? "s" : ""}</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [regeneratingPortrait, setRegeneratingPortrait] = useState(false);

  const handleRegenPortrait = async (char: Character) => {
    if (regeneratingPortrait) return;
    setRegeneratingPortrait(true);
    try {
      const res = await fetch("/api/characters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character: char }),
      });
      const data = await res.json();
      if (data.portrait) {
        const updated = { ...char, portrait: data.portrait };
        setCharacters(prev => prev.map(c => c.name === char.name ? updated : c));
        if (selected?.name === char.name) setSelected(updated);
      }
    } catch {}
    finally { setRegeneratingPortrait(false); }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">CHARACTER BIBLES</h1>
          <p className="text-ink-300 text-sm mt-1">AI-generated characters with portrait art and full profiles.</p>
        </div>
        <button onClick={() => setShowGenerate(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
          <Sparkles size={14} /> Generate Characters
        </button>
      </div>

      {/* Archetype reference grid */}
      {characters.length === 0 && (
        <div>
          <p className="text-ink-400 text-xs uppercase tracking-widest font-semibold mb-4">Character Archetypes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {archetypes.map(a => (
              <div key={a.name} className="bg-ink-800/60 border border-white/5 rounded-xl p-4 hover:border-white/15 transition-all">
                <div className="text-2xl mb-2">{a.icon}</div>
                <p className="font-display text-sm tracking-wider mb-1" style={{ color: a.color }}>{a.name}</p>
                <p className="text-ink-400 text-[11px] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center py-8">
            <User size={40} className="mx-auto mb-4 text-ink-600" />
            <h3 className="font-display text-2xl tracking-wider text-ink-400 mb-2">No Characters Yet</h3>
            <p className="text-ink-500 text-sm mb-6">Generate characters from a series bible or custom context.</p>
            <button onClick={() => setShowGenerate(true)}
              className="px-6 py-3 rounded-xl font-display tracking-widest text-sm"
              style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
              Generate Characters
            </button>
          </div>
        </div>
      )}

      {characters.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {characters.map((c, i) => (
            <CharacterCard key={`${c.name}-${i}`} char={c} onSelect={setSelected} />
          ))}
          <motion.div
            onClick={() => setShowGenerate(true)}
            className="group cursor-pointer">
            <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-crimson-500/40 flex flex-col items-center justify-center gap-2 transition-all bg-ink-800/20">
              <Plus size={20} className="text-crimson-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-ink-500">Add Characters</span>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showGenerate && (
          <GenerateModal
            onClose={() => setShowGenerate(false)}
            onGenerated={chars => setCharacters(prev => [...chars, ...prev])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <CharacterDetailModal
            char={selected}
            onClose={() => setSelected(null)}
            onRegenPortrait={handleRegenPortrait}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
