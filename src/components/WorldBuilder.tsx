"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, MapPin, Users, Scroll, Landmark, Layers,
  Sparkles, Loader, X, RefreshCw, ImageIcon, ChevronDown,
  Zap, Shield, Crown, Mountain, Star
} from "lucide-react";

interface WorldData {
  world_name: string;
  world_concept: string;
  geography: string[];
  factions: { name: string; ideology: string; power: string }[];
  lore: string;
  mysteries: string[];
  map_image?: string;
  rules: string[];
  history: string;
  threats: string[];
}

function Section({ icon, title, color, children, collapsible = true }: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-ink-800/60 border border-white/5 rounded-2xl overflow-hidden mb-4">
      <button onClick={() => collapsible && setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-5 py-4 hover:bg-ink-700/30 transition-colors text-left">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
          {icon}
        </div>
        <span className="font-display text-base tracking-wider text-white flex-1">{title}</span>
        {collapsible && <ChevronDown size={14} className={`text-ink-500 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      {(!collapsible || open) && (
        <div className="px-5 pb-5">{children}</div>
      )}
    </div>
  );
}

function GenerateWorldModal({ onClose, onGenerated }: {
  onClose: () => void;
  onGenerated: (w: WorldData) => void;
}) {
  const [bibles, setBibles] = useState<{ id: string; series_title: string; world_name: string }[]>([]);
  const [selectedBible, setSelectedBible] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [includeMap, setIncludeMap] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/bibles").then(r => r.json()).then(d => setBibles(d.bibles || []));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/world-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bibleId: selectedBible, customContext, includeMap }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      onGenerated(data.world);
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
            <h3 className="font-display text-lg tracking-wider text-white">Build a World</h3>
            <p className="text-ink-400 text-xs mt-0.5">AI generates full world bible + map art</p>
          </div>
          <button onClick={onClose} disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-ink-400 transition-all">
            <X size={13} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {bibles.length > 0 && (
            <div>
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">From Story Bible</label>
              <select value={selectedBible} onChange={e => setSelectedBible(e.target.value)}
                className="w-full bg-ink-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-crimson-500/50">
                <option value="">— None, use custom context —</option>
                {bibles.map(b => <option key={b.id} value={b.id}>{b.series_title}{b.world_name ? ` (${b.world_name})` : ""}</option>)}
              </select>
            </div>
          )}
          {!selectedBible && (
            <div>
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">World Concept</label>
              <textarea value={customContext} onChange={e => setCustomContext(e.target.value)}
                placeholder="Describe the world concept, genre, tone, key ideas..."
                className="w-full h-28 bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-crimson-500/50 resize-none" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <button onClick={() => setIncludeMap(!includeMap)}
              className="w-5 h-5 rounded flex items-center justify-center transition-all flex-shrink-0"
              style={{ backgroundColor: includeMap ? "rgba(255,77,109,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${includeMap ? "#ff4d6d" : "rgba(255,255,255,0.1)"}` }}>
              {includeMap && <span className="text-crimson-400 text-[10px] font-bold">✓</span>}
            </button>
            <span className="text-sm text-ink-200">Generate world map image</span>
          </div>
          {error && <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          <button onClick={handleGenerate} disabled={loading || (!customContext.trim() && !selectedBible)}
            className="w-full py-3 rounded-xl font-display tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #00d4ff, #0099cc)", color: "white" }}>
            {loading ? <><Loader size={14} className="animate-spin" />Building World...</> : <><Globe size={14} />Build World</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function WorldBuilder() {
  const [worlds, setWorlds] = useState<WorldData[]>([]);
  const [active, setActiveWorld] = useState<WorldData | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);

  const handleGenerated = (world: WorldData) => {
    setWorlds(prev => [world, ...prev]);
    setActiveWorld(world);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">WORLD BUILDER</h1>
          <p className="text-ink-300 text-sm mt-1">Generate full world bibles with geography, factions, lore, and map art.</p>
        </div>
        <div className="flex items-center gap-2">
          {worlds.length > 1 && (
            <select value={worlds.indexOf(active!)} onChange={e => setActiveWorld(worlds[Number(e.target.value)])}
              className="bg-ink-700 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
              {worlds.map((w, i) => <option key={i} value={i}>{w.world_name}</option>)}
            </select>
          )}
          <button onClick={() => setShowGenerate(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #00d4ff, #0099cc)", color: "white" }}>
            <Globe size={14} /> Build World
          </button>
        </div>
      </div>

      {!active && (
        <div className="text-center py-20">
          <Globe size={48} className="mx-auto mb-4 text-ink-600" />
          <h3 className="font-display text-2xl tracking-wider text-ink-400 mb-2">No Worlds Built Yet</h3>
          <p className="text-ink-500 text-sm mb-6">Generate a world from a story bible or from scratch.</p>
          <button onClick={() => setShowGenerate(true)}
            className="px-6 py-3 rounded-xl font-display tracking-widest text-sm"
            style={{ background: "linear-gradient(135deg, #00d4ff, #0099cc)", color: "white" }}>
            Build World
          </button>
        </div>
      )}

      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
          {/* World name header */}
          <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5 mb-4">
            <h2 className="font-display text-3xl tracking-widest text-white mb-1">{active.world_name}</h2>
            <p className="text-ink-200 text-sm leading-relaxed">{active.world_concept}</p>
          </div>

          {/* Map */}
          {active.map_image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-white/10">
              <img src={active.map_image} alt={`${active.world_name} Map`} className="w-full object-cover max-h-80" />
            </div>
          )}

          {/* Geography */}
          {active.geography?.length > 0 && (
            <Section icon={<Mountain size={14} style={{ color: "#10b981" }} />} title="Geography & Regions" color="#10b981">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {active.geography.map((g, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                    <MapPin size={11} className="text-green-400/50 mt-0.5 flex-shrink-0" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Factions */}
          {active.factions?.length > 0 && (
            <Section icon={<Crown size={14} style={{ color: "#ffd700" }} />} title="Factions & Powers" color="#ffd700">
              <div className="space-y-3">
                {active.factions.map((f, i) => (
                  <div key={i} className="border-l-2 border-yellow-500/30 pl-3">
                    <p className="text-white text-sm font-semibold">{f.name}</p>
                    <p className="text-ink-400 text-xs mt-0.5">{f.ideology}</p>
                    <p className="text-yellow-400/70 text-[11px] mt-0.5">{f.power}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* World rules */}
          {active.rules?.length > 0 && (
            <Section icon={<Scroll size={14} style={{ color: "#a855f7" }} />} title="World Rules & Laws" color="#a855f7">
              <div className="space-y-1.5">
                {active.rules.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                    <span className="text-purple-400 font-display text-sm leading-none mt-0.5">{i + 1}</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* History */}
          {active.history && (
            <Section icon={<Landmark size={14} style={{ color: "#f59e0b" }} />} title="Ancient History & Lore" color="#f59e0b">
              <p className="text-ink-200 text-sm leading-relaxed">{active.history}</p>
            </Section>
          )}

          {/* Mysteries */}
          {active.mysteries?.length > 0 && (
            <Section icon={<Star size={14} style={{ color: "#00d4ff" }} />} title="Unsolved Mysteries" color="#00d4ff">
              <div className="space-y-1.5">
                {active.mysteries.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                    <span className="text-cyan-400/50 text-base leading-none mt-0.5">?</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Threats */}
          {active.threats?.length > 0 && (
            <Section icon={<Shield size={14} style={{ color: "#ff4d6d" }} />} title="World Threats" color="#ff4d6d">
              <div className="space-y-1.5">
                {active.threats.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                    <span className="text-crimson-400/50 text-base leading-none mt-0.5">!</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showGenerate && (
          <GenerateWorldModal onClose={() => setShowGenerate(false)} onGenerated={handleGenerated} />
        )}
      </AnimatePresence>
    </div>
  );
}
