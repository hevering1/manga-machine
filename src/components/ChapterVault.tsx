"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, BookOpen, Plus, Clock, ChevronRight, FileText,
  X, Copy, Check, RefreshCw, Filter, Loader, Search,
  Edit3, CheckCircle, Circle, ArrowRight
} from "lucide-react";

interface Chapter {
  id: string;
  bible_id?: string;
  series_title: string;
  chapter_number: number;
  chapter_title: string;
  arc_name: string;
  script: string;
  panel_notes: string;
  status: string;
  created_date: string;
}

const statusConfig: Record<string, { color: string; bg: string; next: string }> = {
  "Outlined":  { color: "#888",    bg: "rgba(128,128,128,0.1)", next: "Draft"    },
  "Draft":     { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  next: "Revised"  },
  "Revised":   { color: "#a855f7", bg: "rgba(168,85,247,0.1)",  next: "Final"    },
  "Final":     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  next: ""         },
};

const STATUS_ORDER = ["Outlined", "Draft", "Revised", "Final"];

function KanbanColumn({ status, chapters, onSelect, onAdvance }: {
  status: string;
  chapters: Chapter[];
  onSelect: (c: Chapter) => void;
  onAdvance: (id: string, next: string) => void;
}) {
  const cfg = statusConfig[status];
  return (
    <div className="flex-1 min-w-52">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: cfg.color }}>{status}</span>
        <span className="text-ink-500 text-[10px] ml-auto">{chapters.length}</span>
      </div>
      <div className="space-y-2 min-h-24">
        {chapters.map(ch => (
          <motion.div key={ch.id} layout
            className="bg-ink-800 border border-white/5 rounded-xl p-3 cursor-pointer hover:border-white/15 transition-all group"
            onClick={() => onSelect(ch)}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-display text-2xl text-crimson-400/30 leading-none">{ch.chapter_number}</span>
              {cfg.next && (
                <button
                  onClick={e => { e.stopPropagation(); onAdvance(ch.id, cfg.next); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  <ArrowRight size={8} /> {cfg.next}
                </button>
              )}
            </div>
            <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{ch.chapter_title}</p>
            {ch.arc_name && <p className="text-ink-500 text-[10px] mt-1 truncate">{ch.arc_name}</p>}
            <p className="text-ink-500 text-[9px] mt-2">{ch.series_title}</p>
          </motion.div>
        ))}
        {chapters.length === 0 && (
          <div className="border border-dashed border-white/5 rounded-xl h-20 flex items-center justify-center">
            <span className="text-ink-600 text-[10px]">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ScriptViewer({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(13);

  const handleCopy = () => {
    navigator.clipboard.writeText(chapter.script || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="text-crimson-400 text-[10px] font-semibold uppercase tracking-widest mb-0.5 flex items-center gap-1">
              <FileText size={10} /> Chapter Script
            </div>
            <h2 className="font-display text-xl tracking-wider text-white">
              Ch.{chapter.chapter_number} — {chapter.chapter_title}
            </h2>
            {chapter.arc_name && <p className="text-ink-400 text-xs">{chapter.arc_name} · {chapter.series_title}</p>}
          </div>
          <div className="flex items-center gap-2">
            {/* Font size */}
            <div className="flex items-center gap-1 bg-ink-700 rounded-lg px-2 py-1 border border-white/10">
              <button onClick={() => setFontSize(s => Math.max(10, s - 1))}
                className="text-ink-400 hover:text-white text-sm w-5 text-center">−</button>
              <span className="text-ink-300 text-[10px] w-5 text-center">{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(18, s + 1))}
                className="text-ink-400 hover:text-white text-sm w-5 text-center">+</button>
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white transition-all">
              {copied ? <><Check size={11} className="text-green-400" />Copied</> : <><Copy size={11} />Copy</>}
            </button>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Script */}
        <div className="flex-1 overflow-y-auto p-6">
          {chapter.script ? (
            <pre className="whitespace-pre-wrap font-mono leading-relaxed text-ink-100"
              style={{ fontSize: `${fontSize}px` }}>
              {chapter.script}
            </pre>
          ) : (
            <div className="text-center py-16 text-ink-500">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p>No script content yet.</p>
            </div>
          )}
          {chapter.panel_notes && (
            <div className="mt-6 border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4">
              <p className="text-yellow-400 text-[10px] font-semibold uppercase tracking-widest mb-2">Key Visual Moments</p>
              <p className="text-ink-200 text-xs leading-relaxed">{chapter.panel_notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChapterVault() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selected, setSelected] = useState<Chapter | null>(null);
  const [search, setSearch] = useState("");

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chapters");
      const data = await res.json();
      setChapters(data.chapters || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchChapters(); }, []);

  const handleAdvance = async (id: string, next: string) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, status: next } : c));
    try {
      await fetch("/api/chapters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
    } catch {}
  };

  const filtered = chapters.filter(c => {
    const q = search.toLowerCase();
    return !q || c.chapter_title?.toLowerCase().includes(q) ||
      c.series_title?.toLowerCase().includes(q) ||
      c.arc_name?.toLowerCase().includes(q);
  });

  const byStatus = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = filtered.filter(c => (c.status || "Draft") === s);
    return acc;
  }, {} as Record<string, Chapter[]>);

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">CHAPTER VAULT</h1>
          <p className="text-ink-300 text-sm mt-1">All your chapter scripts. Track progress from outline to final.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)" }}>
            {chapters.length} Chapters
          </span>
          <button onClick={fetchChapters}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="flex bg-ink-700 border border-white/10 rounded-xl overflow-hidden">
            {(["kanban","list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 text-xs font-semibold transition-all capitalize"
                style={{ backgroundColor: view === v ? "rgba(255,77,109,0.2)" : "transparent", color: view === v ? "#ff4d6d" : "#555" }}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search chapters, series, arcs..."
          className="w-full pl-9 pr-4 py-2.5 bg-ink-700 border border-white/10 rounded-xl text-white placeholder-ink-500 text-sm focus:outline-none focus:border-crimson-500/50 transition-colors" />
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48 gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Database size={20} className="text-crimson-400" />
          </motion.div>
          <p className="text-ink-400 text-sm">Loading vault...</p>
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <div className="text-center py-20">
          <Database size={40} className="mx-auto mb-4 text-ink-600" />
          <h3 className="font-display text-2xl tracking-wider text-ink-400 mb-2">Vault Empty</h3>
          <p className="text-ink-500 text-sm">Generate chapter scripts from the Story Engine to fill your vault.</p>
        </div>
      )}

      {!loading && chapters.length > 0 && view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_ORDER.map(s => (
            <KanbanColumn key={s} status={s} chapters={byStatus[s]} onSelect={setSelected} onAdvance={handleAdvance} />
          ))}
        </div>
      )}

      {!loading && chapters.length > 0 && view === "list" && (
        <div className="space-y-2">
          {filtered.map(ch => {
            const cfg = statusConfig[ch.status || "Draft"] || statusConfig["Draft"];
            return (
              <motion.div key={ch.id} layout
                onClick={() => setSelected(ch)}
                className="flex items-center gap-4 bg-ink-800/60 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-white/15 transition-all group">
                <span className="font-display text-2xl text-crimson-400/30 w-8 text-center leading-none">{ch.chapter_number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-crimson-300 transition-colors">{ch.chapter_title}</p>
                  <p className="text-ink-400 text-xs truncate">{ch.series_title}{ch.arc_name ? ` · ${ch.arc_name}` : ""}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  {ch.status || "Draft"}
                </span>
                <ChevronRight size={14} className="text-ink-600 group-hover:text-crimson-400 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && <ScriptViewer chapter={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
