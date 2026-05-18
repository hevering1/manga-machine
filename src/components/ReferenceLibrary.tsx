"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, BookOpen, Star, ChevronDown, X,
  Plus, Loader, CheckCircle, RefreshCw, Zap, Globe,
  Users, Flame, TrendingUp, AlertCircle
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
  research_status: string;
}

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#ffd700" stroke="none" />)}
    </div>
  );
}

function TagPill({ label, color }: { label: string; color?: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${color || "#ffffff"}15`, color: color || "#aaa", border: `1px solid ${color || "#ffffff"}25` }}>
      {label}
    </span>
  );
}

function SeriesDetailPanel({ series, onClose }: { series: Series; onClose: () => void }) {
  const tags = Array.isArray(series.tags) ? series.tags : (series.tags ? String(series.tags).split(",").map(t => t.trim()) : []);
  const genres = Array.isArray(series.genre) ? series.genre : (series.genre ? String(series.genre).split(",").map(g => g.trim()) : []);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-ink-800 border-l border-white/10 z-50 overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-ink-800 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {series.type && <TagPill label={series.type} color={typeColors[series.type]} />}
            {series.status && <TagPill label={series.status} color={statusColors[series.status]} />}
          </div>
          <h2 className="font-display text-xl tracking-wider text-white leading-tight">{series.title}</h2>
          {series.author && <p className="text-ink-400 text-xs mt-0.5">{series.author}{series.origin_country ? ` · ${series.origin_country}` : ""}</p>}
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
          <X size={14} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => <TagPill key={t} label={t} color="#888" />)}
            {genres.map(g => <TagPill key={g} label={g} color="#ff4d6d" />)}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Chapters", val: series.chapter_count || "—" },
            { label: "Pacing", val: series.pacing_style || "—" },
            { label: "Period", val: (series as any).time_period_setting || "—" },
          ].map(s => (
            <div key={s.label} className="bg-ink-700 rounded-xl p-3 text-center border border-white/5">
              <div className="text-white text-sm font-semibold">{s.val}</div>
              <div className="text-ink-400 text-[10px] uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
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
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-300 uppercase tracking-widest mb-1.5">
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
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/add-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      onAdded(data.series);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-lg tracking-wider text-white">Add to Library</h3>
            <p className="text-ink-400 text-xs mt-0.5">AI will research & analyze the series automatically</p>
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
              className="w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-crimson-500/50 transition-colors"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>
          )}

          <button onClick={handleAdd} disabled={loading || !title.trim()}
            className="w-full py-3 rounded-xl font-display tracking-widest text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{ background: loading ? "rgba(255,77,109,0.3)" : "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            {loading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Loader size={14} /></motion.div>Researching...</>
            ) : (
              <><Plus size={14} />Add Series</>
            )}
          </button>

          {loading && (
            <p className="text-center text-ink-400 text-xs">AI is analyzing the series — this takes ~10 seconds</p>
          )}
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
  const [filterOpen, setFilterOpen] = useState(false);

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

  const handleAdded = (newSeries: Series) => {
    setSeries(prev => [newSeries, ...prev]);
  };

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
          <button onClick={() => fetchLibrary()}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all"
            title="Refresh">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white" }}>
            <Plus size={13} /> Add Series
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search series, genre, tags..."
            className="w-full pl-9 pr-4 py-2.5 bg-ink-700 border border-white/10 rounded-xl text-white placeholder-ink-500 text-sm focus:outline-none focus:border-crimson-500/50 transition-colors" />
        </div>
        <div className="flex gap-2">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: typeFilter === t ? `${typeColors[t]}20` : "rgba(255,255,255,0.04)",
                color: typeFilter === t ? typeColors[t] : "#666",
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

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const tags = Array.isArray(s.tags) ? s.tags : String(s.tags || "").split(",").map(t => t.trim()).filter(Boolean);
            const typeColor = typeColors[s.type] || "#888";
            const statusColor = statusColors[s.status] || "#888";
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(s)}
                className="bg-ink-800/70 border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-white/15 transition-all group relative overflow-hidden"
                style={{ borderLeft: `3px solid ${typeColor}60` }}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, ${typeColor}, transparent)` }} />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <TagPill label={s.type || "—"} color={typeColor} />
                    {s.status && <TagPill label={s.status} color={statusColor} />}
                  </div>
                  <StarRating />
                </div>

                <h3 className="font-display text-xl tracking-wider text-white mb-0.5 group-hover:text-crimson-300 transition-colors leading-tight">
                  {s.title}
                </h3>
                {s.author && (
                  <p className="text-ink-400 text-xs mb-3">
                    {s.author}{s.origin_country ? ` · ${s.origin_country}` : ""}
                  </p>
                )}

                {s.power_system && (
                  <p className="text-ink-300 text-xs leading-relaxed mb-3 line-clamp-2">{s.power_system}</p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 4).map(t => <TagPill key={t} label={t} />)}
                    {tags.length > 4 && <span className="text-ink-500 text-[10px] self-center">+{tags.length - 4}</span>}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Add card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: filtered.length * 0.03 }}
            onClick={() => setShowAdd(true)}
            className="border-2 border-dashed border-white/10 hover:border-crimson-500/40 rounded-2xl p-5 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[160px] group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.2)" }}>
              <Plus size={18} className="text-crimson-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center">
              <div className="text-white text-sm font-semibold mb-0.5">Add Series</div>
              <div className="text-ink-500 text-xs">AI researches & analyzes instantly</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty state */}
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
