"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, Star, X, Plus, Loader,
  RefreshCw, Zap, Globe, Users, Flame, TrendingUp, AlertCircle, ImageIcon
} from "lucide-react";

const typeColors: Record<string, string> = {
  "Manga": "#ff4d6d",
  "Manhwa": "#00d4ff",
  "Manhua": "#ffd700",
  "Webtoon": "#a855f7",
};

const statusColors: Record<string, string> = {
  "Complete": "#10b981",
  "Ongoing": "#3b82f6",
  "Hiatus": "#f59e0b",
};

interface Series {
  id: string;
  title: string;
  type: string;
  genre: string[] | string;
  status: string;
  author: string;
  origin_country: string;
  tone: string;
  world_building: string;
  power_system: string;
  protagonist_archetype: string;
  antagonist_archetype: string;
  what_made_it_great: string;
  virality_factors: string;
  best_story_arcs: string;
  weaknesses: string;
  tags: string[] | string;
  chapter_count: string;
  pacing_style: string;
  art_style_notes: string;
  time_period_setting: string;
  research_status: string;
  cover_image: string;
}

function TagPill({ label, color }: { label: string; color?: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${color || "#ffffff"}15`, color: color || "#888", border: `1px solid ${color || "#ffffff"}25` }}>
      {label}
    </span>
  );
}

function SeriesDetailPanel({ series, onClose }: { series: Series; onClose: () => void }) {
  const tags = Array.isArray(series.tags) ? series.tags : String(series.tags || "").split(",").map(t => t.trim()).filter(Boolean);
  const genres = Array.isArray(series.genre) ? series.genre : [String(series.genre || "")];
  const typeColor = typeColors[series.type] || "#888";

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-ink-800 border-l border-white/10 z-50 overflow-y-auto shadow-2xl">

      {/* Cover hero */}
      <div className="relative h-72 overflow-hidden">
        {series.cover_image ? (
          <img src={series.cover_image} alt={series.title}
            className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink-700">
            <ImageIcon size={40} className="text-ink-500" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/40 to-transparent" />
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all">
          <X size={14} />
        </button>
        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            {series.type && <TagPill label={series.type} color={typeColor} />}
            {series.status && <TagPill label={series.status} color={statusColors[series.status]} />}
          </div>
          <h2 className="font-display text-2xl tracking-wider text-white leading-tight">{series.title}</h2>
          {series.author && (
            <p className="text-ink-300 text-xs mt-0.5">{series.author}{series.origin_country ? ` · ${series.origin_country}` : ""}</p>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Tags */}
        {(tags.length > 0 || genres.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {genres.filter(Boolean).map(g => <TagPill key={g} label={g} color="#ff4d6d" />)}
            {tags.map(t => <TagPill key={t} label={t} />)}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Chapters", val: series.chapter_count || "—" },
            { label: "Pacing", val: series.pacing_style || "—" },
            { label: "Period", val: series.time_period_setting || "—" },
          ].map(s => (
            <div key={s.label} className="bg-ink-700 rounded-xl p-3 text-center border border-white/5">
              <div className="text-white text-sm font-semibold truncate">{s.val}</div>
              <div className="text-ink-400 text-[10px] uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Art style */}
        {series.art_style_notes && (
          <div className="bg-ink-700/50 border border-white/5 rounded-xl p-4">
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold mb-1">Art Style</p>
            <p className="text-ink-200 text-sm leading-relaxed">{series.art_style_notes}</p>
          </div>
        )}

        {/* Info sections */}
        {[
          { icon: <Globe size={13} className="text-blue-400" />, label: "World Building", val: series.world_building },
          { icon: <Zap size={13} className="text-yellow-400" />, label: "Power System", val: series.power_system },
          { icon: <Users size={13} className="text-green-400" />, label: "Protagonist", val: series.protagonist_archetype },
          { icon: <Flame size={13} className="text-red-400" />, label: "Antagonist", val: series.antagonist_archetype },
          { icon: <Star size={13} className="text-yellow-400" />, label: "What Made It Great", val: series.what_made_it_great },
          { icon: <TrendingUp size={13} className="text-pink-400" />, label: "Virality Factors", val: series.virality_factors },
          { icon: <BookOpen size={13} className="text-purple-400" />, label: "Best Arcs", val: series.best_story_arcs },
          { icon: <AlertCircle size={13} className="text-orange-400" />, label: "Weaknesses", val: series.weaknesses },
        ].filter(s => s.val).map(s => (
          <div key={s.label}>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-1.5">
              {s.icon} {s.label}
            </div>
            <p className="text-ink-100 text-sm leading-relaxed">{s.val}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AddSeriesModal({ onClose, onAdded }: { onClose: () => void; onAdded: (s: Series) => void }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"idle" | "researching" | "cover" | "saving">("idle");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    setStage("researching");
    try {
      // Fake stage progression for UX
      const timer1 = setTimeout(() => setStage("cover"), 6000);
      const timer2 = setTimeout(() => setStage("saving"), 14000);

      const res = await fetch("/api/add-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();
      if (data.error) { setError(data.error); setStage("idle"); return; }
      onAdded(data.series);
      onClose();
    } catch (e: any) {
      setError(e.message);
      setStage("idle");
    } finally {
      setLoading(false);
    }
  };

  const stageLabels: Record<string, string> = {
    researching: "Researching series...",
    cover: "Generating cover art...",
    saving: "Saving to library...",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-lg tracking-wider text-white">Add to Library</h3>
            <p className="text-ink-400 text-xs mt-0.5">AI researches, writes analysis & generates cover art</p>
          </div>
          <button onClick={onClose} disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-ink-400 transition-all">
            <X size={13} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-ink-300 uppercase tracking-widest font-semibold block mb-2">Series Name</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && handleAdd()}
              placeholder="e.g. Nano Machine, Lookism, Wind Breaker..."
              autoFocus
              disabled={loading}
              className="w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-crimson-500/50 transition-colors disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>
          )}

          {/* Progress stages */}
          {loading && (
            <div className="space-y-2">
              {(["researching", "cover", "saving"] as const).map((s) => {
                const stageOrder = ["researching", "cover", "saving"];
                const currentIdx = stageOrder.indexOf(stage);
                const thisIdx = stageOrder.indexOf(s);
                const isDone = thisIdx < currentIdx;
                const isActive = thisIdx === currentIdx;
                return (
                  <div key={s} className="flex items-center gap-3 text-xs"
                    style={{ opacity: thisIdx > currentIdx ? 0.3 : 1 }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isDone ? "rgba(16,185,129,0.2)" : isActive ? "rgba(255,77,109,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isDone ? "#10b981" : isActive ? "#ff4d6d" : "rgba(255,255,255,0.1)"}`,
                      }}>
                      {isDone ? (
                        <span className="text-green-400 text-[10px]">✓</span>
                      ) : isActive ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Loader size={10} className="text-crimson-400" />
                        </motion.div>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-500" />
                      )}
                    </div>
                    <span style={{ color: isDone ? "#10b981" : isActive ? "#fff" : "#555" }}>
                      {stageLabels[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={handleAdd} disabled={loading || !title.trim()}
            className="w-full py-3 rounded-xl font-display tracking-widest text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            {loading ? "Working..." : <><Plus size={14} />Add Series</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ReferenceLibrary() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Series | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/library");
      const data = await res.json();
      setSeries(data.series || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLibrary(); }, []);

  const filtered = series.filter(s => {
    const q = search.toLowerCase();
    const tags = Array.isArray(s.tags) ? s.tags : String(s.tags || "").split(",");
    const genre = Array.isArray(s.genre) ? s.genre : [String(s.genre || "")];
    const matchesSearch = !q || s.title?.toLowerCase().includes(q) ||
      genre.some(g => g.toLowerCase().includes(q)) ||
      tags.some(t => t.toLowerCase().includes(q)) ||
      s.tone?.toLowerCase().includes(q);
    const matchesType = !typeFilter || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAdded = (newSeries: Series) => setSeries(prev => [newSeries, ...prev]);

  const types = ["Manga", "Manhwa", "Manhua", "Webtoon"];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">REFERENCE LIBRARY</h1>
          <p className="text-ink-300 text-sm mt-1">Deconstruct the greats. Build something greater.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(255,215,0,0.1)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.25)" }}>
            {loading ? "..." : series.length} Series
          </span>
          <button onClick={fetchLibrary}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            <Plus size={13} /> Add Series
          </button>
        </div>
      </div>

      {/* Search + Type Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search series, genre, tags..."
            className="w-full pl-9 pr-4 py-2.5 bg-ink-700 border border-white/10 rounded-xl text-white placeholder-ink-500 text-sm focus:outline-none focus:border-crimson-500/50 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: typeFilter === t ? `${typeColors[t]}20` : "rgba(255,255,255,0.04)",
                color: typeFilter === t ? typeColors[t] : "#555",
                border: `1px solid ${typeFilter === t ? typeColors[t] + "40" : "rgba(255,255,255,0.07)"}`,
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <BookOpen size={24} className="text-crimson-400" />
          </motion.div>
          <p className="text-ink-400 text-sm">Loading library...</p>
        </div>
      )}

      {/* Cover grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((s, i) => {
            const typeColor = typeColors[s.type] || "#888";
            const tags = Array.isArray(s.tags) ? s.tags : String(s.tags || "").split(",").map(t => t.trim()).filter(Boolean);
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(s)}
                className="group cursor-pointer">
                {/* Cover image */}
                <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3] bg-ink-700 border border-white/5 group-hover:border-white/20 transition-all shadow-lg group-hover:shadow-crimson-500/10 group-hover:scale-[1.02] duration-200">
                  {s.cover_image ? (
                    <img src={s.cover_image} alt={s.title}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-ink-700">
                      <ImageIcon size={24} className="text-ink-500" />
                      <span className="text-ink-500 text-[10px]">No cover</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/80">{t}</span>
                      ))}
                    </div>
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: `${typeColor}cc`, color: "#fff" }}>
                      {s.type?.split(" ")[0]}
                    </span>
                  </div>
                  {/* Status dot */}
                  {s.status && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColors[s.status] || "#888" }}
                      title={s.status} />
                  )}
                </div>

                {/* Title + author */}
                <div>
                  <p className="text-white text-xs font-semibold leading-tight group-hover:text-crimson-300 transition-colors line-clamp-2">{s.title}</p>
                  {s.author && <p className="text-ink-500 text-[10px] mt-0.5 truncate">{s.author}</p>}
                </div>
              </motion.div>
            );
          })}

          {/* Add card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: filtered.length * 0.04 }}
            onClick={() => setShowAdd(true)}
            className="group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3] border-2 border-dashed border-white/10 hover:border-crimson-500/50 transition-all flex flex-col items-center justify-center gap-3 bg-ink-800/30 hover:bg-ink-700/30">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.25)" }}>
                <Plus size={18} className="text-crimson-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-center px-2">
                <div className="text-white text-[11px] font-semibold">Add Series</div>
                <div className="text-ink-500 text-[9px] mt-0.5">AI art + analysis</div>
              </div>
            </div>
            <p className="text-ink-500 text-[10px] text-center">New Series</p>
          </motion.div>
        </div>
      )}

      {/* Empty search state */}
      {!loading && filtered.length === 0 && series.length > 0 && (
        <div className="text-center py-16 text-ink-500">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p>No series match "{search}"</p>
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selected && <SeriesDetailPanel series={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && <AddSeriesModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
      </AnimatePresence>
    </div>
  );
}
