"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2, TrendingUp, AlertTriangle, CheckCircle, Zap,
  Sparkles, Loader, RefreshCw, Star, Flame, Target,
  MessageSquare, ChevronDown, Info
} from "lucide-react";

interface AuditResult {
  overall_score: number;
  virality_score: number;
  hook_strength: number;
  pacing_score: number;
  originality_score: number;
  emotional_resonance: number;
  market_fit: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  chapter_1_critique: string;
  chapter_2_critique: string;
  chapter_3_critique: string;
  tiktok_potential: string;
  reddit_potential: string;
  first_page_hook: string;
  recommended_fixes: string[];
  comparable_hits: string[];
  series_dna: { series: string; influence: number }[];
}

function ScoreBar({ label, score, color, benchmark }: { label: string; score: number; color: string; benchmark?: number }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-ink-300">{label}</span>
        <div className="flex items-center gap-2">
          {benchmark && (
            <span className="text-[10px] text-ink-500">avg {benchmark}</span>
          )}
          <span className="text-sm font-display tracking-wider" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {benchmark && (
        <div className="relative h-0">
          <div className="absolute w-px h-3 -top-2.5 bg-white/20"
            style={{ left: `${benchmark}%` }} />
        </div>
      )}
    </div>
  );
}

function DNABar({ series, influence, index }: { series: string; influence: number; index: number }) {
  const colors = ["#ff4d6d", "#ffd700", "#00d4ff", "#a855f7", "#10b981", "#f59e0b"];
  const color = colors[index % colors.length];
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-ink-300 text-xs w-36 truncate">{series}</span>
      <div className="flex-1 h-1.5 bg-ink-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${influence}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-semibold w-8 text-right" style={{ color }}>{influence}%</span>
    </div>
  );
}

export default function StoryAuditor({ setActive }: { setActive?: (s: string) => void }) {
  const [mode, setMode] = useState<"paste" | "select">("paste");
  const [input, setInput] = useState("");
  const [bibles, setBibles] = useState<{ id: string; series_title: string }[]>([]);
  const [selectedBible, setSelectedBible] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [loadingBibles, setLoadingBibles] = useState(false);

  const loadBibles = async () => {
    setLoadingBibles(true);
    try {
      const res = await fetch("/api/bibles");
      const data = await res.json();
      setBibles(data.bibles || []);
    } catch {}
    finally { setLoadingBibles(false); }
  };

  const handleAudit = async () => {
    const content = mode === "paste" ? input : selectedBible;
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mode }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data.audit);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 80 ? "#10b981" : s >= 60 ? "#ffd700" : "#ff4d6d";

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BarChart2 className="text-purple-400" size={20} />
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">STORY AUDITOR</h1>
        </div>
        <p className="text-ink-300 text-sm">AI-powered critique engine. Scores virality, pacing, and market fit.</p>
      </div>

      {/* Input panel */}
      {!result && (
        <div className="max-w-3xl">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-4">
            {[{ id: "paste", label: "Paste Content" }, { id: "select", label: "From Active Series" }].map(m => (
              <button key={m.id} onClick={() => { setMode(m.id as any); if (m.id === "select") loadBibles(); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  backgroundColor: mode === m.id ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)",
                  color: mode === m.id ? "#a855f7" : "#555",
                  border: `1px solid ${mode === m.id ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.07)"}`,
                }}>
                {m.label}
              </button>
            ))}
          </div>

          {mode === "paste" && (
            <div className="mb-4">
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">
                Paste your series bible, chapter script, or story concept
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your series title, premise, power system, character descriptions, first chapter outline... The more detail, the better the audit."
                className="w-full h-48 bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              />
            </div>
          )}

          {mode === "select" && (
            <div className="mb-4">
              <label className="text-xs text-ink-400 uppercase tracking-widest font-semibold block mb-2">
                Select a Series Bible
              </label>
              {loadingBibles ? (
                <div className="flex items-center gap-2 text-ink-400 text-sm py-4">
                  <Loader size={14} className="animate-spin" /> Loading bibles...
                </div>
              ) : bibles.length === 0 ? (
                <div className="text-ink-500 text-sm py-4">No bibles found. Generate one in the Story Engine first.</div>
              ) : (
                <div className="space-y-2">
                  {bibles.map(b => (
                    <button key={b.id} onClick={() => setSelectedBible(b.id)}
                      className="w-full text-left px-4 py-3 rounded-xl border transition-all text-sm"
                      style={{
                        backgroundColor: selectedBible === b.id ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)",
                        borderColor: selectedBible === b.id ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.07)",
                        color: selectedBible === b.id ? "#a855f7" : "#aaa",
                      }}>
                      {b.series_title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">{error}</div>}

          <motion.button
            onClick={handleAudit}
            disabled={loading || (!input.trim() && !selectedBible)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-display tracking-widest text-base flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", color: "white" }}>
            {loading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><BarChart2 size={16} /></motion.div>AUDITING...</>
            ) : (
              <><Zap size={16} />RUN STORY AUDIT</>
            )}
          </motion.button>
        </div>
      )}

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
          {/* Overall score hero */}
          <div className="bg-ink-800/80 border border-white/10 rounded-2xl p-6 mb-6 flex items-center gap-6 flex-wrap">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle cx="50" cy="50" r="40" fill="none"
                  stroke={scoreColor(result.overall_score)} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - result.overall_score / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl" style={{ color: scoreColor(result.overall_score) }}>{result.overall_score}</span>
                <span className="text-[10px] text-ink-400 uppercase tracking-widest">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl tracking-wider text-white mb-2">Audit Complete</h2>
              <p className="text-ink-200 text-sm leading-relaxed">{result.verdict}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {result.comparable_hits?.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-ink-300 border border-white/10">{c}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setResult(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-all">
              <RefreshCw size={12} className="inline mr-1.5" />New Audit
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score breakdown */}
            <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                <Star size={14} className="text-yellow-400" /> Score Breakdown
              </h3>
              <ScoreBar label="Virality Potential" score={result.virality_score} color="#ff4d6d" benchmark={72} />
              <ScoreBar label="Hook Strength" score={result.hook_strength} color="#ffd700" benchmark={68} />
              <ScoreBar label="Pacing" score={result.pacing_score} color="#00d4ff" benchmark={74} />
              <ScoreBar label="Originality" score={result.originality_score} color="#a855f7" benchmark={65} />
              <ScoreBar label="Emotional Resonance" score={result.emotional_resonance} color="#10b981" benchmark={70} />
              <ScoreBar label="Market Fit" score={result.market_fit} color="#f59e0b" benchmark={71} />
            </div>

            {/* Series DNA */}
            {result.series_dna?.length > 0 && (
              <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
                <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                  <Zap size={14} className="text-crimson-400" /> Series DNA Fingerprint
                </h3>
                <p className="text-ink-400 text-xs mb-4">Which existing series this most resembles in DNA</p>
                {result.series_dna.map((d, i) => (
                  <DNABar key={d.series} series={d.series} influence={d.influence} index={i} />
                ))}
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" /> Strengths
              </h3>
              <div className="space-y-2 mb-5">
                {result.strengths?.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-ink-200">{s}</span>
                  </div>
                ))}
              </div>
              <h3 className="font-display text-base tracking-wider text-white mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-400" /> Weaknesses
              </h3>
              <div className="space-y-2">
                {result.weaknesses?.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-ink-200">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral Potential */}
            <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-pink-400" /> Viral Platform Potential
              </h3>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold">TikTok / Short Video</span>
                </div>
                <p className="text-ink-200 text-sm leading-relaxed">{result.tiktok_potential}</p>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold">Reddit / Community</span>
                </div>
                <p className="text-ink-200 text-sm leading-relaxed">{result.reddit_potential}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold">First Page Hook</span>
                </div>
                <p className="text-ink-200 text-sm leading-relaxed">{result.first_page_hook}</p>
              </div>
            </div>

            {/* Chapter critiques */}
            <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-cyan-400" /> Chapter-Level Critique
              </h3>
              {[
                { ch: 1, text: result.chapter_1_critique },
                { ch: 2, text: result.chapter_2_critique },
                { ch: 3, text: result.chapter_3_critique },
              ].filter(c => c.text).map(c => (
                <div key={c.ch} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-display text-lg text-crimson-400/50 leading-none">Ch.{c.ch}</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <p className="text-ink-200 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Recommended fixes */}
            {result.recommended_fixes?.length > 0 && (
              <div className="bg-ink-800/60 border border-white/10 rounded-2xl p-5">
                <h3 className="font-display text-base tracking-wider text-white mb-4 flex items-center gap-2">
                  <Target size={14} className="text-orange-400" /> Recommended Fixes
                </h3>
                <div className="space-y-2.5">
                  {result.recommended_fixes.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                        style={{ backgroundColor: "rgba(255,77,109,0.15)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}>
                        {i + 1}
                      </span>
                      <span className="text-ink-200 text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
