"use client";
import { motion } from "framer-motion";
import { Layers, Plus, Sparkles, ChevronRight } from "lucide-react";

export default function ActiveSeries({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gradient-red">ACTIVE SERIES</h1>
        <p className="text-ink-300 text-sm mt-1">Your current story projects.</p>
      </div>

      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-20 h-20 rounded-2xl bg-ink-700 border border-white/5 flex items-center justify-center">
          <Layers size={36} className="text-ink-500" />
        </div>
        <p className="text-ink-400 text-center">No active series yet.<br/>Use the Story Engine to generate your first one.</p>
        <button
          onClick={() => setActive("engine")}
          className="px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-sm font-semibold transition-all flex items-center gap-2"
        >
          <Sparkles size={16} /> Launch Story Engine
        </button>
      </div>
    </div>
  );
}
