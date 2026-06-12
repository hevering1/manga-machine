"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Sparkles, ChevronRight, RotateCw, Copy, Check,
  Loader, Camera, MessageSquare, BookOpen, Zap, Layout,
  Download, RefreshCw, Eye, ChevronDown, ChevronUp
} from "lucide-react";

const ART_STYLES = [
  { id: "shonen", label: "Shonen", desc: "Bold angles, explosive energy" },
  { id: "seinen", label: "Seinen", desc: "Gritty, detailed, mature" },
  { id: "shojo", label: "Shojo", desc: "Soft lines, emotional depth" },
  { id: "isekai", label: "Isekai", desc: "Fantasy world, epic scale" },
  { id: "cyberpunk", label: "Cyberpunk", desc: "Neon city, tech noir" },
  { id: "noir", label: "Noir", desc: "High contrast, mystery mood" },
  { id: "webtoon", label: "Webtoon", desc: "Vertical scroll, clean beats" },
  { id: "watercolor", label: "Watercolor", desc: "Soft, painterly scenes" },
];

const PAGE_COUNTS = [2, 3, 5, 8, 10];

const PANEL_LAYOUTS = [
  { id: "2x2", label: "2×2 Grid", icon: "▦" },
  { id: "top_wide", label: "Top Wide", icon: "▬" },
  { id: "bottom_wide", label: "Bottom Wide", icon: "▭" },
  { id: "3_panel", label: "3 Panel", icon: "▥" },
  { id: "single", label: "Single", icon: "□" },
  { id: "webtoon", label: "Webtoon", icon: "▯" },
];

interface Panel {
  panel: number;
  shot: string;
  action: string;
  dialogue: string;
  caption: string;
  mood: string;
}

interface Page {
  page: number;
  layout: string;
  scene_header: string;
  panels: Panel[];
  page_hook: string;
}

interface Storyboard {
  title: string;
  style: string;
  total_pages: number;
  pages: Page[];
}

export default function StoryboardGenerator({ addToast }: { addToast?: (m: string, t?: any) => void }) {
  const [prose, setProse] = useState("");
  const [artStyle, setArtStyle] = useState("shonen");
  const [pageCount, setPageCount] = useState(3);
  const [panelLayout, setPanelLayout] = useState("2x2");
  const [loading, setLoading] = useState(false);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([0]));
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prose.trim()) { addToast?.("Paste your scene or chapter first", "error"); return; }
    setLoading(true);
    setStoryboard(null);
    try {
      const res = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prose, artStyle, pageCount, panelLayout }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStoryboard(data.storyboard);
      setExpandedPages(new Set([0]));
      addToast?.("Storyboard generated!", "success");
    } catch (e: any) {
      addToast?.(e.message || "Generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!storyboard) return;
    const text = storyboard.pages.map(p =>
      `PAGE ${p.page} — ${p.scene_header}\n` +
      p.panels.map(panel =>
        `  Panel ${panel.panel} [${panel.shot}]: ${panel.action}\n` +
        (panel.dialogue ? `  Dialogue: "${panel.dialogue}"\n` : "") +
        (panel.caption ? `  Caption: ${panel.caption}\n` : "")
      ).join("") +
      `  ↳ Hook: ${p.page_hook}\n`
    ).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast?.("Storyboard copied!", "success");
  };

  const togglePage = (idx: number) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(255,77,109,0.2))", border: "1px solid rgba(168,85,247,0.3)" }}>
            <Film size={20} style={{ color: "#a855f7" }} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
              STORYBOARD GENERATOR
            </h1>
            <p className="text-xs text-white/40">Prose → Panel-by-panel visual breakdown</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Input */}
        <div className="space-y-5">
          {/* Prose input */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 block">Your Scene / Chapter</label>
            <textarea
              value={prose}
              onChange={e => setProse(e.target.value)}
              placeholder="Paste your scene, chapter excerpt, or rough plot summary here. Include character names, setting, and the key emotional beat or conflict..."
              rows={10}
              className="w-full bg-transparent text-white/80 text-sm resize-none outline-none placeholder:text-white/20 leading-relaxed"
            />
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
              <span className="text-xs text-white/30">{prose.length} characters</span>
              <div className="flex gap-2">
                {["A hero discovers his power", "Two rivals clash at dawn", "The villain reveals his plan"].map(ex => (
                  <button key={ex} onClick={() => setProse(ex)}
                    className="text-[10px] px-2 py-1 rounded-lg text-white/40 hover:text-white/70 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    {ex.split(" ").slice(0, 3).join(" ")}…
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Art Style */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 block">Art Style</label>
            <div className="grid grid-cols-4 gap-2">
              {ART_STYLES.map(s => (
                <button key={s.id} onClick={() => setArtStyle(s.id)}
                  className="rounded-xl p-2.5 text-left transition-all"
                  style={{
                    background: artStyle === s.id ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${artStyle === s.id ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <div className="text-xs font-bold text-white/80">{s.label}</div>
                  <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{s.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Panel Layout + Page Count */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 block">Panel Layout</label>
              <div className="grid grid-cols-3 gap-1.5">
                {PANEL_LAYOUTS.map(l => (
                  <button key={l.id} onClick={() => setPanelLayout(l.id)}
                    className="rounded-lg p-2 text-center transition-all"
                    style={{
                      background: panelLayout === l.id ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${panelLayout === l.id ? "rgba(255,77,109,0.4)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <div className="text-sm">{l.icon}</div>
                    <div className="text-[9px] text-white/50 mt-0.5">{l.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 block">Pages</label>
              <div className="grid grid-cols-3 gap-1.5">
                {PAGE_COUNTS.map(n => (
                  <button key={n} onClick={() => setPageCount(n)}
                    className="rounded-lg p-3 text-center font-black text-sm transition-all"
                    style={{
                      background: pageCount === n ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${pageCount === n ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                      color: pageCount === n ? "#ffd700" : "rgba(255,255,255,0.5)",
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Generate button */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={generate} disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-3 transition-all"
            style={{
              background: loading ? "rgba(168,85,247,0.1)" : "linear-gradient(135deg, #a855f7, #ff4d6d)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "white",
              fontFamily: "Bangers, cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}>
            {loading ? <><Loader size={18} className="animate-spin" /> GENERATING STORYBOARD...</> : <><Film size={18} /> GENERATE STORYBOARD</>}
          </motion.button>
        </div>

        {/* RIGHT — Output */}
        <div>
          <AnimatePresence mode="wait">
            {!storyboard && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full rounded-2xl flex flex-col items-center justify-center p-8 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <Film size={40} className="text-white/10 mb-4" />
                <p className="text-white/20 text-sm">Your storyboard will appear here</p>
                <p className="text-white/10 text-xs mt-1">Page map · Panel briefs · Dialogue · Hooks</p>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full rounded-2xl flex flex-col items-center justify-center p-8 gap-4"
                style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)" }}>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                    <Film size={28} style={{ color: "#a855f7" }} />
                  </div>
                  <motion.div className="absolute -inset-1 rounded-2xl border border-purple-500/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }} />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm font-semibold">Breaking into panels...</p>
                  <p className="text-white/30 text-xs mt-1">Camera cuts · Dialogue · Hooks</p>
                </div>
              </motion.div>
            )}

            {storyboard && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-3">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-white/80">{storyboard.title}</h3>
                    <p className="text-xs text-white/30">{storyboard.total_pages} pages · {storyboard.style} style</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={generate}
                      className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                      <RefreshCw size={11} /> Reroll
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={copyAll}
                      className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                      style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }}>
                      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy All</>}
                    </motion.button>
                  </div>
                </div>

                {/* Pages */}
                {storyboard.pages.map((page, pi) => (
                  <motion.div key={pi} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.05 }}
                    className="rounded-xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Page header */}
                    <button onClick={() => togglePage(pi)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                          style={{ background: "rgba(255,77,109,0.15)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>
                          {page.page}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white/70">{page.scene_header}</p>
                          <p className="text-[10px] text-white/30">{page.panels?.length || 0} panels · {page.layout}</p>
                        </div>
                      </div>
                      {expandedPages.has(pi) ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                    </button>

                    {/* Panel details */}
                    <AnimatePresence>
                      {expandedPages.has(pi) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden">
                          <div className="px-4 pb-4 space-y-2">
                            {page.panels?.map((panel, i) => (
                              <div key={i} className="rounded-lg p-3"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Camera size={11} style={{ color: "#a855f7" }} />
                                  <span className="text-[10px] font-bold text-white/50 uppercase">{panel.shot}</span>
                                  <span className="text-[10px] text-white/20">·</span>
                                  <span className="text-[10px] text-white/30 italic">{panel.mood}</span>
                                </div>
                                <p className="text-xs text-white/70 mb-2">{panel.action}</p>
                                {panel.dialogue && (
                                  <div className="flex items-start gap-1.5">
                                    <MessageSquare size={10} className="text-yellow-400/60 mt-0.5 shrink-0" />
                                    <p className="text-xs text-yellow-400/70 italic">"{panel.dialogue}"</p>
                                  </div>
                                )}
                                {panel.caption && (
                                  <div className="flex items-start gap-1.5 mt-1">
                                    <BookOpen size={10} className="text-blue-400/60 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-blue-400/60">{panel.caption}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                            {/* Hook */}
                            <div className="flex items-center gap-2 pt-1">
                              <Zap size={11} style={{ color: "#ffd700" }} />
                              <p className="text-xs text-yellow-400/60 italic">{page.page_hook}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
