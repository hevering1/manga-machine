"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Heart, Eye, BookOpen, Sparkles, Filter,
  ChevronRight, Star, TrendingUp, Clock, Grid, List, X, Zap
} from "lucide-react";

const FILTERS = ["All", "Series Bible", "Chapter Script", "Cover Art", "Character", "World"];
const SORTS = ["Newest", "Most Viewed", "Top Rated"];

// Pulls from saved SeriesBibles in the DB
interface GalleryItem {
  id: string;
  title: string;
  type: string;
  tagline: string;
  tone: string;
  cover?: string;
  protagonist?: string;
  power_system?: string;
  created_date: string;
  status: string;
}

export default function Gallery({ setActive, addToast }: { setActive?: (p: string) => void; addToast?: (m: string, t?: any) => void }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bibles");
      const data = await res.json();
      const mapped = (data.bibles || []).map((b: any) => ({
        id: b.id,
        title: b.series_title || "Untitled",
        type: "Series Bible",
        tagline: b.tagline || "",
        tone: b.tone || "",
        cover: b.cover_image || null,
        protagonist: b.protagonist_name || "",
        power_system: b.power_system_name || "",
        created_date: b.created_date || new Date().toISOString(),
        status: b.status || "Draft",
      }));
      setItems(mapped);
    } catch {
      addToast?.("Failed to load gallery", "error");
    } finally {
      setLoading(false);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sort === "Newest") return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    return 0;
  });

  const filtered = filter === "All" ? sortedItems : sortedItems.filter(i => i.type === filter);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(255,77,109,0.2), rgba(255,215,0,0.2))", border: "1px solid rgba(255,77,109,0.3)" }}>
              <Star size={20} style={{ color: "#ffd700" }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
                CREATION GALLERY
              </h1>
              <p className="text-xs text-white/40">All your saved bibles, scripts & worlds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode("grid")}
              className="p-2 rounded-lg transition-all"
              style={{ background: viewMode === "grid" ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${viewMode === "grid" ? "rgba(255,77,109,0.3)" : "rgba(255,255,255,0.08)"}` }}>
              <Grid size={14} style={{ color: viewMode === "grid" ? "#ff4d6d" : "rgba(255,255,255,0.4)" }} />
            </button>
            <button onClick={() => setViewMode("list")}
              className="p-2 rounded-lg transition-all"
              style={{ background: viewMode === "list" ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${viewMode === "list" ? "rgba(255,77,109,0.3)" : "rgba(255,255,255,0.08)"}` }}>
              <List size={14} style={{ color: viewMode === "list" ? "#ff4d6d" : "rgba(255,255,255,0.4)" }} />
            </button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActive?.("engine")}
              className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white", fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
              <Sparkles size={13} /> NEW SERIES
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: filter === f ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f ? "rgba(255,77,109,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: filter === f ? "#ff4d6d" : "rgba(255,255,255,0.4)",
            }}>{f}</button>
        ))}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {SORTS.map(s => (
            <button key={s} onClick={() => setSort(s)}
              className="text-[10px] px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: sort === s ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${sort === s ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: sort === s ? "#ffd700" : "rgba(255,255,255,0.3)",
              }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Sparkles size={28} style={{ color: "#ff4d6d" }} />
            </motion.div>
            <p className="text-white/30 text-sm mt-3">Loading your creations...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Star size={40} className="text-white/10 mb-4" />
          <p className="text-white/30 text-sm">No creations yet</p>
          <p className="text-white/15 text-xs mt-1">Generate your first series bible to see it here</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setActive?.("engine")} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-black"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white", fontFamily: "Bangers, cursive" }}>
            GENERATE FIRST SERIES
          </motion.button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(item)}
              className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Cover */}
              <div className="aspect-[2/3] relative overflow-hidden"
                style={{ background: item.cover ? "transparent" : "linear-gradient(135deg, rgba(255,77,109,0.1), rgba(168,85,247,0.1))" }}>
                {item.cover ? (
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={32} className="text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] px-2 py-1 rounded-full font-bold"
                    style={{ background: "rgba(255,77,109,0.8)", color: "white" }}>View</span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{ background: item.status === "Published" ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.1)", color: item.status === "Published" ? "white" : "rgba(255,255,255,0.4)" }}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-black text-white/80 leading-tight mb-1 line-clamp-1">{item.title}</p>
                <p className="text-[10px] text-white/30 line-clamp-2 leading-tight">{item.tagline}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-white/20">{timeAgo(item.created_date)}</span>
                  {item.tone && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "rgba(168,85,247,0.8)" }}>{item.tone}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => setSelected(item)}
              className="rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors group"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(255,77,109,0.1), rgba(168,85,247,0.1))" }}>
                {item.cover ? <img src={item.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={16} className="m-auto mt-4 text-white/20" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white/80">{item.title}</p>
                <p className="text-xs text-white/30 truncate">{item.tagline}</p>
                <div className="flex items-center gap-3 mt-1">
                  {item.protagonist && <span className="text-[10px] text-white/20">Protagonist: {item.protagonist}</span>}
                  {item.power_system && <span className="text-[10px] text-white/20">Power: {item.power_system}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-white/20">{timeAgo(item.created_date)}</span>
                <div className="mt-1">
                  <span className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,77,109,0.1)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}>
                    {item.type}
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl overflow-hidden"
              style={{ background: "rgba(18,18,18,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {selected.cover && (
                <div className="h-48 overflow-hidden">
                  <img src={selected.cover} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-black text-white" style={{ fontFamily: "Bangers, cursive" }}>{selected.title}</h2>
                    <p className="text-xs text-white/40 mt-0.5">{selected.tagline}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/70 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {selected.protagonist && (
                    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-[10px] text-white/30 uppercase mb-1">Protagonist</p>
                      <p className="text-sm text-white/70 font-bold">{selected.protagonist}</p>
                    </div>
                  )}
                  {selected.power_system && (
                    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-[10px] text-white/30 uppercase mb-1">Power System</p>
                      <p className="text-sm text-white/70 font-bold">{selected.power_system}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setActive?.("series"); setSelected(null); }}
                    className="flex-1 py-3 rounded-xl text-sm font-black"
                    style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)", color: "white", fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
                    OPEN IN STUDIO
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setActive?.("vault"); setSelected(null); }}
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                    <BookOpen size={15} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
