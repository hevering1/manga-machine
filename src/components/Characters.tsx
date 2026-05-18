"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, User, Zap, Heart, Sword, Shield } from "lucide-react";

const archetypes = [
  { name: "The Zero", desc: "Starts powerless, becomes unstoppable", color: "#ff4d6d", icon: "⚡" },
  { name: "The Prodigy", desc: "Born gifted, carries the weight of expectation", color: "#ffd700", icon: "👑" },
  { name: "The Anti-Hero", desc: "Does dark things for the right reasons", color: "#a855f7", icon: "🌑" },
  { name: "The Veteran", desc: "Seen it all, hiding a broken past", color: "#10b981", icon: "🛡" },
  { name: "The Rival", desc: "Mirror to the protagonist, different path", color: "#00d4ff", icon: "⚔️" },
  { name: "The Mastermind", desc: "Three steps ahead of everyone", color: "#f97316", icon: "🧠" },
];

const statLabels = ["Power", "Intelligence", "Speed", "Endurance", "Charisma", "Arc Depth"];

export default function Characters() {
  const [selected, setSelected] = useState<typeof archetypes[0] | null>(null);
  const [stats] = useState([85, 70, 90, 75, 80, 95]);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gradient-red">CHARACTER BIBLES</h1>
        <p className="text-ink-300 text-sm mt-1">Forge unforgettable characters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Archetypes */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl tracking-widest text-white mb-4">CHARACTER ARCHETYPES</h2>
          <div className="grid grid-cols-2 gap-3">
            {archetypes.map((a, i) => (
              <motion.button
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(selected?.name === a.name ? null : a)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selected?.name === a.name
                    ? "border-crimson-500/50 bg-crimson-600/10"
                    : "border-white/5 bg-ink-700 hover:border-white/10"
                }`}
              >
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="font-display text-lg tracking-wider mb-1" style={{ color: a.color }}>{a.name}</div>
                <div className="text-xs text-ink-300">{a.desc}</div>
              </motion.button>
            ))}
          </div>

          {/* Create New */}
          <button className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-crimson-500/40 text-ink-400 hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
            <Plus size={16} /> Create Custom Character
          </button>
        </div>

        {/* Stat Radar + Preview */}
        <div className="space-y-4">
          {selected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-ink-700 border border-white/10 p-5"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${selected.color}20`, border: `2px solid ${selected.color}40` }}>
                  {selected.icon}
                </div>
                <div className="font-display text-2xl tracking-wider" style={{ color: selected.color }}>{selected.name}</div>
                <div className="text-xs text-ink-300 mt-1">{selected.desc}</div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                {statLabels.map((label, i) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink-300">{label}</span>
                      <span style={{ color: selected.color }}>{stats[i]}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-600">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: selected.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stats[i]}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: `${selected.color}20`, color: selected.color, border: `1px solid ${selected.color}30` }}>
                Build Full Bible →
              </button>
            </motion.div>
          ) : (
            <div className="rounded-xl bg-ink-700 border border-white/5 p-5 flex flex-col items-center justify-center h-64 text-center">
              <User size={32} className="text-ink-500 mb-3" />
              <p className="text-ink-400 text-sm">Select an archetype to preview stats</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Characters", value: "0", icon: User, color: "#a855f7" },
              { label: "Bibles Done", value: "0", icon: Zap, color: "#ffd700" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl bg-ink-700 border border-white/5 p-4 text-center">
                  <Icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
                  <div className="font-display text-2xl" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-ink-300">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
