"use client";
import { motion } from "framer-motion";
import { Database, BookOpen, Plus, Clock, ChevronRight } from "lucide-react";

const sampleChapters = [
  { ch: 1, title: "The Zero Reading", arc: "Zero Fracture", status: "Outlined", pages: 24, hook: "Kael fails the awakening test publicly — registered as zero." },
  { ch: 2, title: "Glass Floor", arc: "Zero Fracture", status: "Outlined", pages: 22, hook: "Forced into the 'Civilian Reintegration Program'. His classmates move on." },
  { ch: 3, title: "The Crack", arc: "Zero Fracture", status: "Draft", pages: 28, hook: "Alone in a condemned building, something cracks open in the air in front of him." },
];

const arcs = [
  { name: "Zero Fracture", chapters: "1-8", status: "In Progress", color: "#ff4d6d" },
  { name: "First Breach", chapters: "9-18", status: "Planned", color: "#ffd700" },
  { name: "Hidden Cultivation", chapters: "19-30", status: "Planned", color: "#a855f7" },
  { name: "The Tournament", chapters: "31-42", status: "Planned", color: "#00d4ff" },
];

const statusColor: Record<string, string> = {
  "Outlined": "#00d4ff",
  "Draft": "#ffd700",
  "Final": "#10b981",
  "Planned": "#707070",
};

export default function ChapterVault() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gradient-red">CHAPTER VAULT</h1>
        <p className="text-ink-300 text-sm mt-1">Every chapter. Every arc. The full journey.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Arc List */}
        <div>
          <h2 className="font-display text-xl tracking-widest text-white mb-4">STORY ARCS</h2>
          <div className="space-y-3">
            {arcs.map((arc, i) => (
              <motion.div
                key={arc.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-ink-700 border border-white/5 p-4 cursor-pointer hover:border-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-lg tracking-wider text-white group-hover:text-crimson-400 transition-colors">
                    {arc.name}
                  </div>
                  <ChevronRight size={14} className="text-ink-500 group-hover:text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-400">Ch. {arc.chapters}</span>
                  <span className="badge-pill text-[10px]" style={{
                    backgroundColor: `${arc.color}15`, color: arc.color, border: `1px solid ${arc.color}30`
                  }}>
                    {arc.status}
                  </span>
                </div>
              </motion.div>
            ))}
            <button className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-crimson-500/40 text-ink-400 hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
              <Plus size={16} /> New Arc
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="xl:col-span-2">
          <h2 className="font-display text-xl tracking-widest text-white mb-4">CHAPTERS</h2>
          <div className="space-y-3">
            {sampleChapters.map((ch, i) => (
              <motion.div
                key={ch.ch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-ink-700 border border-white/5 p-5 cursor-pointer hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl text-crimson-400">#{ch.ch}</span>
                      <span className="font-semibold text-white group-hover:text-crimson-300 transition-colors">{ch.title}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-ink-400">{ch.arc}</span>
                      <span className="text-xs" style={{ color: statusColor[ch.status] || "#707070" }}>● {ch.status}</span>
                      <span className="text-xs text-ink-400 flex items-center gap-1">
                        <BookOpen size={10} /> {ch.pages}p
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-ink-500 group-hover:text-white mt-1" />
                </div>
                <p className="text-sm text-ink-300 italic">"{ch.hook}"</p>
              </motion.div>
            ))}

            <button className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 hover:border-crimson-500/40 text-ink-400 hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
              <Plus size={16} /> Generate Next Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
