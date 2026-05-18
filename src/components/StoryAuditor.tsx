"use client";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";

const viralityFactors = [
  { label: "Power Fantasy Hook", score: 92, color: "#ff4d6d", benchmark: 88 },
  { label: "Emotional Resonance", score: 78, color: "#a855f7", benchmark: 85 },
  { label: "World Intrigue", score: 88, color: "#00d4ff", benchmark: 80 },
  { label: "Pacing Rhythm", score: 84, color: "#ffd700", benchmark: 82 },
  { label: "Character Depth", score: 75, color: "#10b981", benchmark: 78 },
  { label: "Long-form Potential", score: 95, color: "#f97316", benchmark: 70 },
];

const benchmarks = [
  { series: "Solo Leveling", score: 94, color: "#00d4ff" },
  { series: "One Piece", score: 98, color: "#ffd700" },
  { series: "Tower of God", score: 89, color: "#a855f7" },
  { series: "Your Series", score: 85, color: "#ff4d6d", isYou: true },
];

const recommendations = [
  { type: "warning", text: "Emotional resonance below benchmark — consider adding more personal stakes in Ch.1-5" },
  { type: "success", text: "Long-form potential is exceptional — power system supports 500+ chapters of escalation" },
  { type: "success", text: "Hook strength above Solo Leveling benchmark — strong first chapter pull" },
  { type: "warning", text: "Character depth could be stronger — protagonist needs a visible internal conflict by Ch.3" },
];

export default function StoryAuditor() {
  const overallScore = Math.round(viralityFactors.reduce((a, b) => a + b.score, 0) / viralityFactors.length);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gradient-red">STORY AUDITOR</h1>
        <p className="text-ink-300 text-sm mt-1">Measure your story against the greats.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-ink-700 border border-white/5 p-6 text-center mb-4"
          >
            <div className="text-xs text-ink-300 uppercase tracking-wider mb-2">Virality Score</div>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" stroke="#ff4d6d" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallScore / 100)}`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * 52}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 52 * (1 - overallScore / 100)}` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl text-white">{overallScore}</span>
                <span className="text-xs text-ink-400">/100</span>
              </div>
            </div>
            <div className="font-display text-xl text-crimson-400 mb-1">STRONG CONCEPT</div>
            <p className="text-xs text-ink-300">Above industry average. Refine emotional hooks for breakout potential.</p>
          </motion.div>

          {/* Benchmark */}
          <div className="rounded-xl bg-ink-700 border border-white/5 p-4">
            <h3 className="text-xs uppercase tracking-wider text-ink-300 font-semibold mb-3">vs. Top Series</h3>
            <div className="space-y-3">
              {benchmarks.map((b, i) => (
                <div key={b.series}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={b.isYou ? "text-crimson-400 font-bold" : "text-ink-300"}>{b.series}</span>
                    <span style={{ color: b.color }}>{b.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-600">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: b.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${b.score}%` }}
                      transition={{ delay: i * 0.15 + 0.5, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Factor Bars + Recommendations */}
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-xl bg-ink-700 border border-white/5 p-5">
            <h3 className="font-display text-xl tracking-wider text-white mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-crimson-400" /> FACTOR BREAKDOWN
            </h3>
            <div className="space-y-4">
              {viralityFactors.map((f, i) => (
                <div key={f.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white font-medium">{f.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-ink-400">benchmark: {f.benchmark}</span>
                      <span className="font-bold" style={{ color: f.color }}>{f.score}</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-ink-600">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${f.score}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                    />
                    {/* Benchmark marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/40 rounded-full"
                      style={{ left: `${f.benchmark}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-ink-700 border border-white/5 p-5">
            <h3 className="font-display text-xl tracking-wider text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-gold-400" /> AI RECOMMENDATIONS
            </h3>
            <div className="space-y-3">
              {recommendations.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    r.type === "warning" ? "bg-amber-500/10 border border-amber-500/20" : "bg-green-500/10 border border-green-500/20"
                  }`}
                >
                  {r.type === "warning"
                    ? <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    : <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  }
                  <p className="text-sm text-ink-100">{r.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
