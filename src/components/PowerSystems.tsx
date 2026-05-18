"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, TrendingUp, Shield, Flame, Plus, Sparkles,
  Loader, X, RefreshCw, AlertTriangle, CheckCircle, Star
} from "lucide-react";

interface PowerTier {
  rank: string;
  label: string;
  color: string;
  users: string;
  desc: string;
  abilities?: string;
}

interface PowerSystem {
  name: string;
  concept: string;
  mechanics: string;
  tiers: PowerTier[];
  acquisition: string;
  limits: string;
  evolution: string;
  unique_abilities: string[];
  series?: string;
  stress_test?: StressTestResult;
}

interface StressTestResult {
  score: number;
  verdict: string;
  issues: { severity: "critical" | "warning" | "minor"; description: string }[];
  strengths: string[];
  recommendations: string[];
}

const tierColors = ["#888", "#10b981", "#3b82f6", "#a855f7", "#ffd700", "#ff4d6d", "#ff0000"];

function TierBar({ tier, index, total }: { tier: PowerTier; index: number; total: number }) {
  const width = 30 + (index / (total - 1)) * 70;
  return (
    <div className="mb-3">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: `${tier.color}20`, border: `1px solid ${tier.color}40`, color: tier.color }}>
          {tier.rank}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-xs font-semibold">{tier.label}</span>
            <span className="text-ink-500 text-[10px]">{tier.users}</span>
          </div>
          <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${width}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
              className="h-full rounded-full"
              style={{ backgroundColor: tier.color }}
            />
          </div>
        </div>
      </div>
      <p className="text-ink-400 text-[11px] leading-relaxed ml-11">{tier.desc}</p>
      {tier.abilities && <p className="text-ink-500 text-[10px] ml-11 mt-0.5 italic">{tier.abilities}</p>}
    </div>
  );
}

function StressTestPanel({ result }: { result: StressTestResult }) {
  const scoreColor = result.score >= 80 ? "#10b981" : result.score >= 60 ? "#ffd700" : "#ff4d6d";
  const severityConfig = {
    critical: { color: "#ff4d6d", icon: <AlertTriangle size={12} /> },
    warning:  { color: "#ffd700", icon: <AlertTriangle size={12} /> },
    minor:    { color: "#888",    icon: <AlertTriangle size={12} /> },
  };

  return (
    <div className="mt-6 border border-white/10 rounded-2xl overflow-hidden">
      <div className="bg-ink-700/50 px-5 py-4 flex items-center justify-between">
        <h3 className="font-display text-base tracking-wider text-white flex items-center gap-2">
          <Shield size={14} className="text-orange-400" /> STRESS TEST RESULTS
        </h3>
        <div className="flex items-center gap-2">
          <div className="font-display text-2xl" style={{ color: scoreColor }}>{result.score}</div>
          <div className="text-ink-400 text-xs">/100</div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-ink-200 text-sm leading-relaxed">{result.verdict}</p>

        {result.issues?.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Issues Found</p>
            <div className="space-y-2">
              {result.issues.map((issue, i) => {
                const cfg = severityConfig[issue.severity];
                return (
                  <div key={i} className="flex items-start gap-2 text-sm p-2.5 rounded-xl"
                    style={{ backgroundColor: `${cfg.color}08`, border: `1px solid ${cfg.color}20` }}>
                    <span style={{ color: cfg.color }} className="flex-shrink-0 mt-0.5">{cfg.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase mr-2" style={{ color: cfg.color }}>{issue.severity}</span>
                      <span className="text-ink-200">{issue.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result.strengths?.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Strengths</p>
            <div className="space-y-1.5">
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-ink-200">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.recommendations?.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest mb-2">Recommendations</p>
            <div className="space-y-1.5">
              {result.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(255,77,109,0.15)", color: "#ff4d6d" }}>{i + 1}</span>
                  <span className="text-ink-200">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GeneratePowerModal({ onClose, onGenerated }: {
  onClose: () => void;
  onGenerated: (p: PowerSystem) => void;
}) {
  const [bibles, setBibles] = useState<{ id: string; series_title: string; power_system_name: string }[]>([]);
  const [selectedBible, setSelectedBible] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/bibles").then(r => r.json()).then(d => setBibles(d.bibles || []));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/power-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bibleId: selectedBible, customContext }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      onGenerated(data.system);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-ink-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-lg tracking-wider text-white">Build Power System</h3>
            <p className="text-ink-400 text-xs mt-0.5">AI designs tiers, mechanics, and evolution paths</p>
          </div>
          <button onClick={onClose} disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-ink-400 transition-all">
            <X size={13} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {bibles.length > 0 && (
            <div>
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">From Story Bible</label>
              <select value={selectedBible} onChange={e => setSelectedBible(e.target.value)}
                className="w-full bg-ink-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-crimson-500/50">
                <option value="">— None, use custom context —</option>
                {bibles.map(b => <option key={b.id} value={b.id}>{b.series_title}{b.power_system_name ? ` · ${b.power_system_name}` : ""}</option>)}
              </select>
            </div>
          )}
          {!selectedBible && (
            <div>
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">Power Concept</label>
              <textarea value={customContext} onChange={e => setCustomContext(e.target.value)}
                placeholder="Describe the power system idea, genre, tone..."
                className="w-full h-28 bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-crimson-500/50 resize-none" />
            </div>
          )}
          {error && <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          <button onClick={handleGenerate} disabled={loading || (!customContext.trim() && !selectedBible)}
            className="w-full py-3 rounded-xl font-display tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #ffd700, #e6a500)", color: "#000" }}>
            {loading ? <><Loader size={14} className="animate-spin" />Building...</> : <><Zap size={14} />Build Power System</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PowerSystems() {
  const [systems, setSystems] = useState<PowerSystem[]>([]);
  const [active, setActiveSystem] = useState<PowerSystem | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [runningStressTest, setRunningStressTest] = useState(false);

  const handleGenerated = (sys: PowerSystem) => {
    setSystems(prev => [sys, ...prev]);
    setActiveSystem(sys);
  };

  const runStressTest = async () => {
    if (!active || runningStressTest) return;
    setRunningStressTest(true);
    try {
      const res = await fetch("/api/power-stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: active }),
      });
      const data = await res.json();
      if (data.result) {
        const updated = { ...active, stress_test: data.result };
        setActiveSystem(updated);
        setSystems(prev => prev.map(s => s.name === active.name ? updated : s));
      }
    } catch {}
    finally { setRunningStressTest(false); }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">POWER SYSTEMS</h1>
          <p className="text-ink-300 text-sm mt-1">Design tiered ability systems with evolution paths and stress tests.</p>
        </div>
        <div className="flex items-center gap-2">
          {systems.length > 1 && (
            <select value={systems.indexOf(active!)} onChange={e => setActiveSystem(systems[Number(e.target.value)])}
              className="bg-ink-700 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
              {systems.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
            </select>
          )}
          {active && (
            <button onClick={runStressTest} disabled={runningStressTest}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: "rgba(255,140,0,0.1)", color: "#ff8c00", border: "1px solid rgba(255,140,0,0.25)" }}>
              {runningStressTest ? <><Loader size={12} className="animate-spin" />Testing...</> : <><Shield size={12} />Stress Test</>}
            </button>
          )}
          <button onClick={() => setShowGenerate(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #ffd700, #e6a500)", color: "#000" }}>
            <Zap size={14} /> Build System
          </button>
        </div>
      </div>

      {!active && (
        <div className="text-center py-20">
          <Zap size={48} className="mx-auto mb-4 text-ink-600" />
          <h3 className="font-display text-2xl tracking-wider text-ink-400 mb-2">No Power Systems Yet</h3>
          <p className="text-ink-500 text-sm mb-6">Build a power system from a story bible or from scratch.</p>
          <button onClick={() => setShowGenerate(true)}
            className="px-6 py-3 rounded-xl font-display tracking-widest text-sm"
            style={{ background: "linear-gradient(135deg, #ffd700, #e6a500)", color: "#000" }}>
            Build Power System
          </button>
        </div>
      )}

      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
          <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5 mb-5">
            <h2 className="font-display text-3xl tracking-widest text-white mb-2">{active.name}</h2>
            <p className="text-ink-200 text-sm leading-relaxed mb-3">{active.concept}</p>
            <p className="text-ink-300 text-sm leading-relaxed">{active.mechanics}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Tier chart */}
            <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-yellow-400" /> Power Tiers
              </h3>
              {active.tiers?.map((tier, i) => (
                <TierBar key={tier.rank} tier={tier} index={i} total={active.tiers.length} />
              ))}
            </div>

            {/* System details */}
            <div className="space-y-4">
              {[
                { label: "How Powers Are Acquired", val: active.acquisition, color: "#10b981" },
                { label: "System Limits & Rules", val: active.limits, color: "#ff4d6d" },
                { label: "Evolution & Advancement", val: active.evolution, color: "#a855f7" },
              ].filter(s => s.val).map(s => (
                <div key={s.label} className="bg-ink-800/60 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-ink-200 text-sm leading-relaxed">{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unique abilities */}
          {active.unique_abilities?.length > 0 && (
            <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5 mb-4">
              <h3 className="font-display text-base tracking-wider text-white mb-3 flex items-center gap-2">
                <Star size={14} className="text-yellow-400" /> Signature Abilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {active.unique_abilities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-200 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                    <Zap size={11} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stress test results */}
          {active.stress_test && <StressTestPanel result={active.stress_test} />}
        </motion.div>
      )}

      <AnimatePresence>
        {showGenerate && (
          <GeneratePowerModal onClose={() => setShowGenerate(false)} onGenerated={handleGenerated} />
        )}
      </AnimatePresence>
    </div>
  );
}
