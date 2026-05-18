"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Sparkles, ChevronRight, BookOpen, FileText, Globe,
  Users, Zap, Star, MoreVertical, Edit3, CheckCircle, Clock,
  Play, Pause, Archive, RefreshCw, X, Loader, TrendingUp, ImageIcon
} from "lucide-react";

interface Bible {
  id: string;
  series_title: string;
  tagline: string;
  elevator_pitch: string;
  tone: string;
  protagonist_archetype: string;
  power_system_name: string;
  status: string;
  comparable_series: string;
  virality_hooks: string;
  chapter_arc_structure: string;
  first_10_chapters: string;
  world_name: string;
  target_audience: string;
  created_date: string;
  cover_image?: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "Draft":      { label: "Draft",      color: "#888",    bg: "rgba(128,128,128,0.1)" },
  "Active":     { label: "Active",     color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  "Production": { label: "Production", color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  "Paused":     { label: "Paused",     color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Archived":   { label: "Archived",   color: "#555",    bg: "rgba(80,80,80,0.1)"    },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig["Draft"];
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      {cfg.label}
    </span>
  );
}

function BibleCard({ bible, onSelect, onStatusChange }: {
  bible: Bible;
  onSelect: (b: Bible) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const hooks = (() => {
    try { return JSON.parse(bible.virality_hooks) || []; } catch { return []; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ink-800/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all group relative">

      {/* Cover strip */}
      <div className="h-28 relative overflow-hidden">
        {bible.cover_image ? (
          <img src={bible.cover_image} alt={bible.series_title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255,77,109,0.15), rgba(0,0,0,0.4))" }}>
            <Sparkles size={28} className="text-crimson-400/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={bible.status || "Draft"} />
        </div>
        {/* Menu */}
        <div className="absolute top-2 right-2">
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
            className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
            <MoreVertical size={13} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 w-36 bg-ink-700 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                {["Active", "Production", "Paused", "Draft", "Archived"].map(s => (
                  <button key={s} onClick={(e) => { e.stopPropagation(); onStatusChange(bible.id, s); setMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition-colors flex items-center gap-2"
                    style={{ color: statusConfig[s]?.color || "#aaa" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig[s]?.color || "#aaa" }} />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="p-4" onClick={() => onSelect(bible)}>
        <h3 className="font-display text-xl tracking-wider text-white mb-0.5 group-hover:text-crimson-300 transition-colors">
          {bible.series_title}
        </h3>
        <p className="text-crimson-400 text-xs italic mb-2">{bible.tagline}</p>
        <p className="text-ink-300 text-xs leading-relaxed line-clamp-2 mb-3">{bible.elevator_pitch}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {bible.power_system_name && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(255,215,0,0.1)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.2)" }}>
              <Zap size={8} />{bible.power_system_name}
            </span>
          )}
          {bible.world_name && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
              <Globe size={8} />{bible.world_name}
            </span>
          )}
        </div>

        {hooks.length > 0 && (
          <div className="border-t border-white/5 pt-3">
            <p className="text-[9px] text-ink-500 uppercase tracking-widest font-semibold mb-1.5">Top Hook</p>
            <p className="text-ink-300 text-[11px] leading-relaxed line-clamp-2">{hooks[0]}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-ink-500 text-[10px]">
            {new Date(bible.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button className="flex items-center gap-1 text-crimson-400 text-[10px] font-semibold hover:text-crimson-300 transition-colors">
            View Bible <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function BibleDetailDrawer({ bible, onClose, onStatusChange, setActive }: {
  bible: Bible;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  setActive: (s: string) => void;
}) {
  const hooks = (() => { try { return JSON.parse(bible.virality_hooks) || []; } catch { return []; } })();
  const arcs = (() => { try { return JSON.parse(bible.chapter_arc_structure) || []; } catch { return []; } })();
  const chapters = (() => { try { return JSON.parse(bible.first_10_chapters) || []; } catch { return []; } })();
  const comparables = (() => { try { return JSON.parse(bible.comparable_series) || []; } catch { return typeof bible.comparable_series === "string" ? bible.comparable_series.split(",") : []; } })();

  return (
    <motion.div initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 48 }}
      className="fixed inset-y-0 right-0 w-full max-w-lg bg-ink-800 border-l border-white/10 z-50 overflow-y-auto shadow-2xl">

      {/* Cover */}
      <div className="relative h-56 overflow-hidden">
        {bible.cover_image ? (
          <img src={bible.cover_image} alt={bible.series_title} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255,77,109,0.2), rgba(0,0,0,0.8))" }}>
            <Sparkles size={48} className="text-crimson-400/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/30 to-transparent" />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all">
          <X size={14} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={bible.status || "Draft"} />
          </div>
          <h2 className="font-display text-2xl tracking-wider text-white">{bible.series_title}</h2>
          <p className="text-crimson-400 text-sm italic">{bible.tagline}</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Status controls */}
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold mb-2">Pipeline Status</p>
          <div className="flex gap-2 flex-wrap">
            {["Draft", "Active", "Production", "Paused"].map(s => (
              <button key={s} onClick={() => onStatusChange(bible.id, s)}
                className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: bible.status === s ? `${statusConfig[s].color}20` : "rgba(255,255,255,0.04)",
                  color: bible.status === s ? statusConfig[s].color : "#555",
                  border: `1px solid ${bible.status === s ? statusConfig[s].color + "40" : "rgba(255,255,255,0.07)"}`,
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-ink-200 text-sm leading-relaxed">{bible.elevator_pitch}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Protagonist", val: bible.protagonist_archetype?.split("—")[0]?.trim() },
            { label: "Power System", val: bible.power_system_name },
            { label: "World", val: bible.world_name },
            { label: "Audience", val: bible.target_audience },
          ].filter(s => s.val).map(s => (
            <div key={s.label} className="bg-ink-700 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-ink-500 uppercase tracking-widest mb-0.5">{s.label}</p>
              <p className="text-white text-xs font-semibold line-clamp-1">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Virality hooks */}
        {hooks.length > 0 && (
          <div>
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
              <TrendingUp size={10} className="text-pink-400" /> Virality Hooks
            </p>
            <div className="space-y-1.5">
              {hooks.map((h: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-ink-200">
                  <span className="text-crimson-400 font-display text-base leading-none mt-0.5">{i + 1}</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story arcs */}
        {arcs.length > 0 && (
          <div>
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
              <BookOpen size={10} className="text-purple-400" /> Story Arcs
            </p>
            <div className="space-y-2">
              {arcs.map((arc: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: ["#ff4d6d","#ffd700","#a855f7","#00d4ff","#10b981"][i % 5] }} />
                  <div>
                    <span className="text-white text-xs font-semibold">{arc.arc_name}</span>
                    <span className="text-ink-500 text-[10px] ml-2">Ch. {arc.chapters}</span>
                    <p className="text-ink-400 text-[11px] mt-0.5">{arc.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter list */}
        {chapters.length > 0 && (
          <div>
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
              <FileText size={10} className="text-cyan-400" /> First 10 Chapters
            </p>
            <div className="space-y-1.5">
              {chapters.map((ch: any) => (
                <div key={ch.chapter} className="flex items-center gap-2 p-2 rounded-lg bg-ink-700/50 border border-white/5">
                  <span className="font-display text-lg text-crimson-400/40 w-6 text-center leading-none">{ch.chapter}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{ch.title}</p>
                    <p className="text-ink-500 text-[10px] italic truncate">↳ {ch.hook}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparables */}
        {comparables.length > 0 && (
          <div>
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold mb-2">Comparable Series</p>
            <div className="flex flex-wrap gap-1.5">
              {comparables.map((c: string) => (
                <span key={c} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-ink-300 border border-white/10">{c.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2 pt-2">
          <button onClick={() => { setActive("vault"); onClose(); }}
            className="flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
            <FileText size={12} /> Chapter Vault
          </button>
          <button onClick={() => { setActive("auditor"); onClose(); }}
            className="flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{ backgroundColor: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
            <TrendingUp size={12} /> Audit Series
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ActiveSeries({ setActive }: { setActive: (s: string) => void }) {
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Bible | null>(null);
  const [filter, setFilter] = useState("All");

  const fetchBibles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bibles");
      const data = await res.json();
      setBibles(data.bibles || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBibles(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setBibles(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    try {
      await fetch("/api/bibles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {}
  };

  const filters = ["All", "Draft", "Active", "Production", "Paused"];
  const filtered = filter === "All" ? bibles : bibles.filter(b => b.status === filter);

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">ACTIVE SERIES</h1>
          <p className="text-ink-300 text-sm mt-1">Your generated story bibles and production pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(255,77,109,0.1)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}>
            {bibles.length} Bibles
          </span>
          <button onClick={fetchBibles}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setActive("engine")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            <Sparkles size={13} /> New Bible
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              backgroundColor: filter === f ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === f ? "#ff4d6d" : "#555",
              border: `1px solid ${filter === f ? "rgba(255,77,109,0.35)" : "rgba(255,255,255,0.07)"}`,
            }}>
            {f} {f !== "All" && <span className="ml-1 opacity-60">{bibles.filter(b => b.status === f).length}</span>}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={24} className="text-crimson-400" />
          </motion.div>
          <p className="text-ink-400 text-sm">Loading series...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <Layers size={40} className="mx-auto mb-4 text-ink-600" />
          <h3 className="font-display text-2xl tracking-wider text-ink-400 mb-2">No Bibles Yet</h3>
          <p className="text-ink-500 text-sm mb-6">Generate your first series bible with the Story Engine.</p>
          <button onClick={() => setActive("engine")}
            className="px-6 py-3 rounded-xl font-display tracking-widest text-sm"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            Open Story Engine
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(b => (
            <BibleCard key={b.id} bible={b} onSelect={setSelected} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <BibleDetailDrawer
            bible={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            setActive={setActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
