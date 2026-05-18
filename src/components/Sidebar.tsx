"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Zap, Users, Globe, Layers, BarChart2,
  ChevronRight, Terminal, Menu, X, Sparkles, Database
} from "lucide-react";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: Terminal, color: "#ff4d6d" },
  { id: "library", label: "Reference Library", icon: BookOpen, color: "#ffd700" },
  { id: "series", label: "Active Series", icon: Layers, color: "#00d4ff" },
  { id: "characters", label: "Characters", icon: Users, color: "#a855f7" },
  { id: "world", label: "World Building", icon: Globe, color: "#10b981" },
  { id: "power", label: "Power Systems", icon: Zap, color: "#f97316" },
  { id: "engine", label: "Story Engine", icon: Sparkles, color: "#ff4d6d" },
  { id: "auditor", label: "Story Auditor", icon: BarChart2, color: "#00d4ff" },
  { id: "vault", label: "Chapter Vault", icon: Database, color: "#ffd700" },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

export default function Sidebar({ active, setActive }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-ink-800 border-r border-white/5 z-50 flex-shrink-0"
    >
      {/* Top */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-crimson-600 flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-display text-xl tracking-widest text-gradient-red">MANGA</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-ink-200 hover:text-white transition-colors p-1 rounded"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 relative group transition-all duration-200
                ${isActive ? "text-white bg-white/5" : "text-ink-200 hover:text-white hover:bg-white/3"}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-bar"
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <Icon
                size={18}
                style={{ color: isActive ? item.color : undefined }}
                className={`flex-shrink-0 transition-colors ${!isActive ? "group-hover:text-white" : ""}`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && isActive && (
                <ChevronRight size={14} className="ml-auto opacity-60" style={{ color: item.color }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-4 border-t border-white/5"
          >
            <div className="rounded-lg bg-crimson-600/10 border border-crimson-600/20 p-3">
              <div className="text-xs text-crimson-400 font-semibold mb-1">SOLO AI Engine</div>
              <div className="text-xs text-ink-200">Story generation active</div>
              <div className="mt-2 h-1 rounded-full bg-ink-600">
                <motion.div
                  className="h-full rounded-full bg-crimson-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "72%" }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
