"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Sparkles, Loader, RefreshCw, Copy, Check,
  Plus, Trash2, ChevronDown, Zap, User, BookOpen
} from "lucide-react";

const BUBBLE_TYPES = [
  { id: "speech", label: "Speech", icon: "💬", desc: "Normal dialogue" },
  { id: "shout", label: "Shout", icon: "📢", desc: "Explosive/anger" },
  { id: "whisper", label: "Whisper", icon: "🤫", desc: "Low/secret" },
  { id: "thought", label: "Thought", icon: "💭", desc: "Inner monologue" },
  { id: "narration", label: "Narration", icon: "📖", desc: "Caption box" },
  { id: "sfx", label: "SFX", icon: "⚡", desc: "Sound effect" },
];

const TONES = ["Intense", "Calm", "Comedic", "Tragic", "Menacing", "Inspirational", "Sarcastic", "Vulnerable"];

interface Character {
  name: string;
  role: string;
  voice: string;
}

interface DialogueLine {
  character: string;
  bubble_type: string;
  text: string;
  direction: string;
}

export default function DialogueGenerator({ addToast }: { addToast?: (m: string, t?: any) => void }) {
  const [scene, setScene] = useState("");
  const [tone, setTone] = useState("Intense");
  const [bubbleType, setBubbleType] = useState("speech");
  const [characters, setCharacters] = useState<Character[]>([
    { name: "", role: "", voice: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DialogueLine[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const addCharacter = () => {
    if (characters.length < 4) setCharacters(c => [...c, { name: "", role: "", voice: "" }]);
  };
  const removeCharacter = (i: number) => setCharacters(c => c.filter((_, j) => j !== i));
  const updateCharacter = (i: number, field: keyof Character, val: string) => {
    setCharacters(c => c.map((ch, j) => j === i ? { ...ch, [field]: val } : ch));
  };

  const generate = async () => {
    if (!scene.trim()) { addToast?.("Describe the scene first", "error"); return; }
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene, tone, bubbleType, characters: characters.filter(c => c.name) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.lines);
      addToast?.("Dialogue generated!", "success");
    } catch (e: any) {
      addToast?.(e.message || "Generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyLine = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    const text = results.map(r => `[${r.character}/${r.bubble_type.toUpperCase()}] "${r.text}"\n→ ${r.direction}`).join("\n\n");
    navigator.clipboard.writeText(text);
    addToast?.("All dialogue copied!", "success");
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,77,109,0.2))", border: "1px solid rgba(255,215,0,0.3)" }}>
            <MessageSquare size={20} style={{ color: "#ffd700" }} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
              DIALOGUE GENERATOR
            </h1>
            <p className="text-xs text-white/40">Speech bubbles, captions & character voice</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          {/* Scene */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 block">Scene Context</label>
            <textarea value={scene} onChange={e => setScene(e.target.value)}
              placeholder="Describe what's happening in the scene. Who's there, what just happened, what needs to be said..."
              rows={5}
              className="w-full bg-transparent text-white/80 text-sm resize-none outline-none placeholder:text-white/20 leading-relaxed" />
          </div>

          {/* Characters */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Characters</label>
              {characters.length < 4 && (
                <button onClick={addCharacter} className="text-xs flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors">
                  <Plus size={11} /> Add
                </button>
              )}
            </div>
            <div className="space-y-3">
              {characters.map((c, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-start">
                  <input value={c.name} onChange={e => updateCharacter(i, "name", e.target.value)}
                    placeholder="Name" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20 w-full" />
                  <input value={c.role} onChange={e => updateCharacter(i, "role", e.target.value)}
                    placeholder="Role (hero/villain)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20 w-full" />
                  <div className="flex gap-1">
                    <input value={c.voice} onChange={e => updateCharacter(i, "voice", e.target.value)}
                      placeholder="Voice (cold/loud)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20 flex-1 min-w-0" />
                    {i > 0 && (
                      <button onClick={() => removeCharacter(i)} className="text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tone + Bubble Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Tone</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    className="text-[10px] px-2 py-1 rounded-lg transition-all"
                    style={{
                      background: tone === t ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${tone === t ? "rgba(255,77,109,0.4)" : "rgba(255,255,255,0.06)"}`,
                      color: tone === t ? "#ff4d6d" : "rgba(255,255,255,0.4)",
                    }}>{t}</button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Bubble Type</label>
              <div className="grid grid-cols-3 gap-1">
                {BUBBLE_TYPES.map(b => (
                  <button key={b.id} onClick={() => setBubbleType(b.id)}
                    className="rounded-lg p-1.5 text-center transition-all"
                    style={{
                      background: bubbleType === b.id ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${bubbleType === b.id ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <div className="text-sm">{b.icon}</div>
                    <div className="text-[9px] text-white/40">{b.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={generate} disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3"
            style={{
              background: loading ? "rgba(255,215,0,0.05)" : "linear-gradient(135deg, #ffd700, #ff8c00)",
              border: "1px solid rgba(255,215,0,0.3)",
              color: loading ? "rgba(255,215,0,0.4)" : "#000",
              fontFamily: "Bangers, cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}>
            {loading ? <><Loader size={18} className="animate-spin" /> WRITING DIALOGUE...</> : <><MessageSquare size={18} /> GENERATE DIALOGUE</>}
          </motion.button>
        </div>

        {/* Output */}
        <div>
          <AnimatePresence mode="wait">
            {results.length === 0 && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <MessageSquare size={36} className="text-white/10 mb-3" />
                <p className="text-white/20 text-sm">Speech bubbles appear here</p>
                <p className="text-white/10 text-xs mt-1">Dialogue · Captions · SFX · Voice direction</p>
              </motion.div>
            )}
            {loading && (
              <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full rounded-2xl flex items-center justify-center min-h-[400px]"
                style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.1)" }}>
                <div className="text-center">
                  <Loader size={28} className="animate-spin mx-auto mb-3" style={{ color: "#ffd700" }} />
                  <p className="text-white/40 text-sm">Writing in character voice...</p>
                </div>
              </motion.div>
            )}
            {results.length > 0 && !loading && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-white/40">{results.length} lines generated</p>
                  <div className="flex gap-2">
                    <button onClick={generate} className="text-xs flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors">
                      <RefreshCw size={10} /> Reroll
                    </button>
                    <button onClick={copyAll} className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", color: "#ffd700" }}>
                      <Copy size={10} /> Copy All
                    </button>
                  </div>
                </div>
                {results.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="rounded-xl p-4 group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User size={10} style={{ color: "#a855f7" }} />
                        <span className="text-[10px] font-bold text-white/50 uppercase">{line.character || "Narrator"}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(255,77,109,0.1)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}>
                          {line.bubble_type}
                        </span>
                      </div>
                      <button onClick={() => copyLine(line.text, i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/70">
                        {copied === i ? <Check size={12} style={{ color: "#10b981" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-sm text-white/80 font-medium mb-1.5">"{line.text}"</p>
                    {line.direction && (
                      <div className="flex items-center gap-1.5">
                        <Zap size={9} style={{ color: "#ffd700" }} />
                        <p className="text-[10px] text-white/30 italic">{line.direction}</p>
                      </div>
                    )}
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
