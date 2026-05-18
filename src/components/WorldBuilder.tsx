"use client";
import { motion } from "framer-motion";
import { Globe, MapPin, Users, Scroll, Landmark, Layers } from "lucide-react";

const worldElements = [
  {
    category: "Geography", icon: MapPin, color: "#10b981",
    items: ["The Grand Rifts — ocean-wide cracks in dimensional fabric", "The Upper Strata Cities — floating metropolises", "Dead Zones — areas where power doesn't work"]
  },
  {
    category: "Factions", icon: Users, color: "#00d4ff",
    items: ["The Sovereign Council — immortal rulers of the upper strata", "Rifter Guilds — mercenary hunter organizations", "The Forgotten — humans left behind by the system"]
  },
  {
    category: "History", icon: Scroll, color: "#ffd700",
    items: ["The First Fracture — 300 years ago, dimensions cracked open", "The Culling Wars — Sovereigns wiping out early powerful Rifters", "The Sealing Accord — secret treaty capping human power"]
  },
  {
    category: "Landmarks", icon: Landmark, color: "#a855f7",
    items: ["Tower of Zeroes — where failed awakeners are sent", "The Abyss Gate — only known portal to the 10th Stratum", "Hall of Records — Sovereign database of every Rifter ever"]
  },
];

export default function WorldBuilder() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gradient-red">WORLD BUILDING</h1>
        <p className="text-ink-300 text-sm mt-1">Build worlds worth exploring for 1000 chapters.</p>
      </div>

      {/* World Map Placeholder */}
      <div className="relative rounded-2xl overflow-hidden bg-ink-700 border border-white/5 h-48 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 halftone opacity-30" />
        <div className="absolute inset-0 speed-line-bg opacity-40" />
        <div className="relative text-center">
          <Globe size={40} className="text-ink-500 mx-auto mb-2" />
          <p className="text-ink-400 text-sm">World map visualization coming soon</p>
          <button className="mt-3 text-xs px-4 py-2 rounded-full bg-ink-600 hover:bg-ink-500 text-white transition-colors border border-white/10">
            Generate World Map
          </button>
        </div>
      </div>

      {/* Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {worldElements.map((el, i) => {
          const Icon = el.icon;
          return (
            <motion.div
              key={el.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-ink-700 border border-white/5 p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${el.color}15` }}>
                  <Icon size={18} style={{ color: el.color }} />
                </div>
                <h3 className="font-display text-xl tracking-wider" style={{ color: el.color }}>{el.category}</h3>
              </div>
              <div className="space-y-2">
                {el.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm text-ink-200">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: el.color }} />
                    {item}
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs px-3 py-1.5 rounded-full border transition-colors hover:text-white"
                style={{ borderColor: `${el.color}30`, color: el.color }}>
                + Add Element
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Depth Scale */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-xl bg-ink-700 border border-white/5 p-5"
      >
        <h3 className="font-display text-xl tracking-wider text-white mb-4 flex items-center gap-2">
          <Layers size={18} className="text-crimson-400" /> STRATUM DEPTH SCALE
        </h3>
        <div className="space-y-2">
          {[
            { level: "Stratum 1-3", label: "Human Zones", color: "#10b981", desc: "Accessible, populated, relatively safe" },
            { level: "Stratum 4-6", label: "Combat Zones", color: "#ffd700", desc: "Hunting grounds, guilds operate here" },
            { level: "Stratum 7-9", label: "Forbidden Zones", color: "#f97316", desc: "Near mythical — only S-rank Rifters survive" },
            { level: "Stratum 10", label: "The Void", color: "#ff4d6d", desc: "Unmapped. Unknown. Only Kael has been here." },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/3">
              <div className="w-20 text-xs font-mono font-bold" style={{ color: s.color }}>{s.level}</div>
              <div className="w-24 text-xs font-semibold text-white">{s.label}</div>
              <div className="flex-1 text-xs text-ink-300">{s.desc}</div>
              <div className="h-1.5 w-20 rounded-full bg-ink-600">
                <div className="h-full rounded-full" style={{ backgroundColor: s.color, width: `${(i + 1) * 25}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
