"use client";
import { motion } from "framer-motion";
import { BookOpen, Users, Zap, Layers, TrendingUp, Clock, ChevronRight, Flame } from "lucide-react";

const stats = [
  { label: "Series in Library", value: "0", icon: BookOpen, color: "#ffd700", change: "+0 this week" },
  { label: "Active Series", value: "0", icon: Layers, color: "#00d4ff", change: "Start creating" },
  { label: "Characters Built", value: "0", icon: Users, color: "#a855f7", change: "Add characters" },
  { label: "Chapters Generated", value: "0", icon: Zap, color: "#ff4d6d", change: "Generate now" },
];

const recentActivity = [
  { action: "System initialized", detail: "Manga Machine ready for input", time: "Just now", color: "#10b981" },
  { action: "Reference Library created", detail: "Ready to accept series via Gmail", time: "Today", color: "#ffd700" },
  { action: "Story Engine online", detail: "AI generation pipeline active", time: "Today", color: "#ff4d6d" },
];

const quickActions = [
  { label: "Add Series via Email", desc: "Email with 'add: Series Name'", color: "#ffd700", icon: "📧" },
  { label: "Start Story Engine", desc: "Generate a new original series", color: "#ff4d6d", icon: "⚡" },
  { label: "Build Character Bible", desc: "Create a detailed character profile", color: "#a855f7", icon: "🧬" },
  { label: "Design Power System", desc: "Build a new power system from scratch", color: "#f97316", icon: "🔥" },
];

export default function Dashboard({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="p-8 space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-ink-700 border border-white/5 p-8 speed-line-bg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-pill bg-crimson-600/20 text-crimson-400 border border-crimson-600/30">
              🔴 LIVE
            </span>
            <span className="badge-pill bg-gold-500/10 text-gold-400 border border-gold-500/20">
              AI POWERED
            </span>
          </div>
          <h1 className="font-display text-6xl tracking-widest text-gradient-red mb-2">
            MANGA MACHINE
          </h1>
          <p className="text-ink-200 text-lg max-w-xl">
            AI-powered creative studio for manga, manhwa & webtoon production. 
            From reference analysis to 1000+ chapter generation pipelines.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActive("engine")}
              className="px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-crimson-600/30 flex items-center gap-2"
            >
              <Flame size={16} /> Launch Story Engine
            </button>
            <button
              onClick={() => setActive("library")}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all border border-white/10 flex items-center gap-2"
            >
              <BookOpen size={16} /> View Library
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="card-hover rounded-xl bg-ink-700 border border-white/5 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <TrendingUp size={14} className="text-ink-300 mt-1" />
              </div>
              <div className="font-display text-4xl tracking-wider mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-white font-medium">{stat.label}</div>
              <div className="text-xs text-ink-300 mt-1">{stat.change}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-ink-700 border border-white/5 p-6"
        >
          <h2 className="font-display text-xl tracking-widest text-white mb-4">QUICK ACTIONS</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-4 p-3 rounded-lg bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group"
              >
                <span className="text-2xl">{action.icon}</span>
                <div className="text-left flex-1">
                  <div className="text-sm font-semibold text-white">{action.label}</div>
                  <div className="text-xs text-ink-300">{action.desc}</div>
                </div>
                <ChevronRight size={16} className="text-ink-400 group-hover:text-white transition-colors" style={{ color: action.color }} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl bg-ink-700 border border-white/5 p-6"
        >
          <h2 className="font-display text-xl tracking-widest text-white mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{item.action}</div>
                  <div className="text-xs text-ink-300">{item.detail}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-400">
                  <Clock size={10} />
                  {item.time}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline visual */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-xs text-ink-300 mb-3 font-semibold uppercase tracking-wider">Pipeline Status</div>
            <div className="flex items-center gap-2">
              {["Gmail Intake", "Research AI", "Library", "Story Engine", "Output"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${i < 3 ? "bg-green-500" : "bg-ink-500"}`} />
                    <span className="text-[9px] text-ink-400 mt-1 whitespace-nowrap">{step}</span>
                  </div>
                  {i < 4 && <div className={`h-px w-4 ${i < 2 ? "bg-green-500/50" : "bg-ink-600"} mb-3`} />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
