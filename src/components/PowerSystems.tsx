"use client";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, Flame } from "lucide-react";

const tiers = [
  { rank: "F", label: "Awakened", color: "#a0a0a0", users: "~2.3M", desc: "Basic ability manifestation. Civilians who awakened." },
  { rank: "E", label: "Hunters", color: "#10b981", users: "~450K", desc: "Capable of entering low-level dungeons safely." },
  { rank: "D", label: "Vanguard", color: "#00d4ff", users: "~80K", desc: "Professional Rifters. Guild entry level." },
  { rank: "C", label: "Elite", color: "#a855f7", users: "~12K", desc: "Recognized fighters. Access to high-value contracts." },
  { rank: "B", label: "Ace", color: "#ffd700", users: "~2K", desc: "National-level threats. Celebrity status." },
  { rank: "A", label: "Legend", color: "#f97316", users: "~200", desc: "Reality-warping power. Government assets." },
  { rank: "S", label: "Sovereign-Adjacent", color: "#ff4d6d", users: "~10", desc: "Near-immortal. The Sovereigns watch these closely." },
  { rank: "???", label: "Void Class", color: "#ffffff", users: "1", desc: "Kael Dusk. The Sovereigns have no record of this rank." },
];

const mechanics = [
  { name: "Fracture Opening", desc: "Rifters tear a hole to another Stratum to pull energy through. Size determines rank.", icon: "⚡", color: "#ff4d6d" },
  { name: "Stratum Diving", desc: "Physically entering another Stratum. High risk, massive power gain potential.", icon: "🌀", color: "#00d4ff" },
  { name: "Ability Crystallization", desc: "At rank B+, Rifters can lock one ability into permanent crystal form.", icon: "💎", color: "#a855f7" },
  { name: "Echo Resonance", desc: "Two Rifters syncing fractures to double output. Rare, requires compatibility.", icon: "🔗", color: "#ffd700" },
];

export default function PowerSystems() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gradient-red">POWER SYSTEMS</h1>
        <p className="text-ink-300 text-sm mt-1">Rules make the magic. Rules can be broken.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tier Table */}
        <div>
          <h2 className="font-display text-xl tracking-widest text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-crimson-400" /> RANK TIER TABLE
          </h2>
          <div className="space-y-2">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-ink-700 border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-lg flex-shrink-0"
                  style={{ backgroundColor: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}30` }}>
                  {tier.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{tier.label}</span>
                    <span className="text-xs text-ink-400">{tier.users}</span>
                  </div>
                  <p className="text-xs text-ink-300 truncate">{tier.desc}</p>
                </div>
                <div className="w-16 h-1 rounded-full bg-ink-600 flex-shrink-0">
                  <div className="h-full rounded-full" style={{ backgroundColor: tier.color, width: `${Math.min((i + 1) * 13, 100)}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mechanics + Visual */}
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-xl tracking-widest text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-gold-400" /> CORE MECHANICS
            </h2>
            <div className="space-y-3">
              {mechanics.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="rounded-xl bg-ink-700 border border-white/5 p-4 flex items-start gap-3"
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="text-sm font-semibold mb-1" style={{ color: m.color }}>{m.name}</div>
                    <p className="text-xs text-ink-300">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weakness / Counter System */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl bg-crimson-600/10 border border-crimson-600/20 p-5"
          >
            <h3 className="font-display text-lg tracking-wider text-crimson-400 mb-3 flex items-center gap-2">
              <Shield size={16} /> BALANCE RULES
            </h3>
            <div className="space-y-2 text-xs text-ink-200">
              <div className="flex gap-2"><span className="text-crimson-400">→</span> Higher Stratum energy corrupts body over time</div>
              <div className="flex gap-2"><span className="text-crimson-400">→</span> Fracture size can shrink from overuse or trauma</div>
              <div className="flex gap-2"><span className="text-crimson-400">→</span> Sovereign seals can suppress any rank below S</div>
              <div className="flex gap-2"><span className="text-gold-400">★</span> Void Class immune to all sealing — Sovereigns don't know why</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
