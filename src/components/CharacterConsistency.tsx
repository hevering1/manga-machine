"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Trash2, Save, Sparkles, Loader, Copy, Check,
  Eye, EyeOff, RefreshCw, User, Palette, Sword, Star, X
} from "lucide-react";

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  age: string;
  archetype: string;
  appearance: string;
  signature_outfit: string;
  hair: string;
  eyes: string;
  distinguishing_marks: string;
  personality: string;
  power: string;
  voice_notes: string;
  art_prompt: string;
  saved: boolean;
}

const ARCHETYPES = ["Protagonist", "Antagonist", "Rival", "Mentor", "Comic Relief", "Love Interest", "Anti-Hero", "Support"];
const ROLES = ["Main Cast", "Supporting", "Recurring", "One-Shot"];

const emptyChar = (): CharacterProfile => ({
  id: Math.random().toString(36).slice(2),
  name: "", role: "Main Cast", age: "", archetype: "Protagonist",
  appearance: "", signature_outfit: "", hair: "", eyes: "",
  distinguishing_marks: "", personality: "", power: "", voice_notes: "",
  art_prompt: "", saved: false,
});

export default function CharacterConsistency({ addToast }: { addToast?: (m: string, t?: any) => void }) {
  const [characters, setCharacters] = useState<CharacterProfile[]>([emptyChar()]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const active = characters[activeIdx];

  const update = (field: keyof CharacterProfile, val: string) => {
    setCharacters(prev => prev.map((c, i) => i === activeIdx ? { ...c, [field]: val } : c));
  };

  const addCharacter = () => {
    const newChar = emptyChar();
    setCharacters(prev => [...prev, newChar]);
    setActiveIdx(characters.length);
  };

  const removeCharacter = (idx: number) => {
    if (characters.length === 1) return;
    setCharacters(prev => prev.filter((_, i) => i !== idx));
    setActiveIdx(Math.max(0, idx - 1));
  };

  const generateArtPrompt = async () => {
    if (!active.name) { addToast?.("Add character name first", "error"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/character-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character: active }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCharacters(prev => prev.map((c, i) => i === activeIdx ? { ...c, art_prompt: data.prompt } : c));
      addToast?.("Art prompt generated!", "success");
    } catch (e: any) {
      addToast?.(e.message || "Failed", "error");
    } finally {
      setGenerating(false);
    }
  };

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
    addToast?.("Prompt copied!", "success");
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(0,212,255,0.3)" }}>
              <Users size={20} style={{ color: "#00d4ff" }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
                CHARACTER CONSISTENCY
              </h1>
              <p className="text-xs text-white/40">Lock your cast — keep them consistent across every panel</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={addCharacter}
            className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #00d4ff20, #a855f720)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
            <Plus size={14} /> Add Character
          </motion.button>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Character tabs */}
        <div className="w-44 shrink-0 space-y-2">
          {characters.map((c, i) => (
            <motion.button key={c.id} onClick={() => setActiveIdx(i)}
              className="w-full text-left rounded-xl p-3 transition-all group relative"
              style={{
                background: i === activeIdx ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === activeIdx ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.06)"}`,
              }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: i === activeIdx ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.05)" }}>
                  <User size={12} style={{ color: i === activeIdx ? "#00d4ff" : "rgba(255,255,255,0.3)" }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white/70 truncate">{c.name || "Unnamed"}</p>
                  <p className="text-[10px] text-white/30 truncate">{c.archetype}</p>
                </div>
              </div>
              {characters.length > 1 && (
                <button onClick={e => { e.stopPropagation(); removeCharacter(i); }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400">
                  <X size={10} />
                </button>
              )}
            </motion.button>
          ))}
        </div>

        {/* Editor */}
        {active && (
          <motion.div key={active.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-4">
            {/* Row 1: Identity */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 block">Identity</label>
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Name *</label>
                  <input value={active.name} onChange={e => update("name", e.target.value)}
                    placeholder="Character name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Age</label>
                  <input value={active.age} onChange={e => update("age", e.target.value)}
                    placeholder="e.g. 17"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Role</label>
                  <select value={active.role} onChange={e => update("role", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {ARCHETYPES.map(a => (
                  <button key={a} onClick={() => update("archetype", a)}
                    className="text-[10px] px-2.5 py-1 rounded-lg transition-all"
                    style={{
                      background: active.archetype === a ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active.archetype === a ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                      color: active.archetype === a ? "#00d4ff" : "rgba(255,255,255,0.4)",
                    }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Row 2: Appearance */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 block flex items-center gap-2">
                <Palette size={11} /> Appearance
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Hair</label>
                  <input value={active.hair} onChange={e => update("hair", e.target.value)}
                    placeholder="e.g. spiky black"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Eyes</label>
                  <input value={active.eyes} onChange={e => update("eyes", e.target.value)}
                    placeholder="e.g. glowing red"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Marks / Scars</label>
                  <input value={active.distinguishing_marks} onChange={e => update("distinguishing_marks", e.target.value)}
                    placeholder="e.g. scar over left eye"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">General Appearance</label>
                  <textarea value={active.appearance} onChange={e => update("appearance", e.target.value)}
                    placeholder="Build, height, face shape, skin tone..."
                    rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20 resize-none" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-1 block">Signature Outfit</label>
                  <textarea value={active.signature_outfit} onChange={e => update("signature_outfit", e.target.value)}
                    placeholder="Describe their iconic look / clothes..."
                    rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none placeholder:text-white/20 resize-none" />
                </div>
              </div>
            </div>

            {/* Row 3: Personality + Power */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <label className="text-[10px] text-white/30 uppercase mb-2 block">Personality</label>
                <textarea value={active.personality} onChange={e => update("personality", e.target.value)}
                  placeholder="How do they act, speak, move? What drives them?"
                  rows={3} className="w-full bg-transparent text-xs text-white/70 outline-none placeholder:text-white/20 resize-none" />
              </div>
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <label className="text-[10px] text-white/30 uppercase mb-2 block">Power / Ability</label>
                <textarea value={active.power} onChange={e => update("power", e.target.value)}
                  placeholder="Main power or skill set, visual effects..."
                  rows={3} className="w-full bg-transparent text-xs text-white/70 outline-none placeholder:text-white/20 resize-none" />
              </div>
            </div>

            {/* Art Prompt */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">AI Art Prompt</label>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={generateArtPrompt} disabled={generating}
                  className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-bold"
                  style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(255,77,109,0.2))", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }}>
                  {generating ? <><Loader size={11} className="animate-spin" /> Generating...</> : <><Sparkles size={11} /> Generate Prompt</>}
                </motion.button>
              </div>
              <div className="relative">
                <textarea value={active.art_prompt} onChange={e => update("art_prompt", e.target.value)}
                  placeholder="Click 'Generate Prompt' to create a consistent AI image prompt for this character, or write your own..."
                  rows={4} className="w-full bg-transparent text-xs text-white/70 outline-none placeholder:text-white/20 resize-none leading-relaxed" />
                {active.art_prompt && (
                  <button onClick={() => copyPrompt(active.id, active.art_prompt)}
                    className="absolute top-0 right-0 text-white/30 hover:text-white/70 transition-colors">
                    {copied === active.id ? <Check size={13} style={{ color: "#10b981" }} /> : <Copy size={13} />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
