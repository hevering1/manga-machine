"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Zap, Users, Globe, Layers, BarChart2,
  ChevronRight, Terminal, Menu, X, Sparkles, Database,
  Home, PanelLeftClose, PanelLeft
} from "lucide-react";

const nav = [
  { id: "dashboard", label: "Dashboard",     icon: Home,     color: "#ff4d6d" },
  { id: "library",   label: "Reference Lib", icon: BookOpen,  color: "#ffd700" },
  { id: "series",    label: "Active Series", icon: Layers,    color: "#ff4d6d" },
  { id: "characters",label: "Characters",    icon: Users,     color: "#a855f7" },
  { id: "world",     label: "World Builder", icon: Globe,     color: "#00d4ff" },
  { id: "power",     label: "Power Systems", icon: Zap,       color: "#ffd700" },
  { id: "engine",    label: "Story Engine",  icon: Sparkles,  color: "#ff4d6d" },
  { id: "auditor",   label: "Story Auditor", icon: BarChart2, color: "#a855f7" },
  { id: "vault",     label: "Chapter Vault", icon: Database,  color: "#00d4ff" },
];

const shortcuts: Record<string, string> = {
  "1": "dashboard", "2": "library", "3": "series", "4": "characters",
  "5": "world", "6": "power", "7": "engine", "8": "auditor", "9": "vault",
};

export default function Sidebar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const page = shortcuts[e.key];
      if (page) setActive(page);
      if (e.key === "b") setCollapsed(c => !c);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setActive]);

  const NavItem = ({ item }: { item: typeof nav[0] }) => {
    const isActive = active === item.id;
    return (
      <motion.button
        onClick={() => { setActive(item.id); setMobileOpen(false); }}
        whileHover={{ x: collapsed ? 0 : 3 }}
        title={collapsed ? item.label : undefined}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
        style={{
          backgroundColor: isActive ? `${item.color}15` : "transparent",
          border: `1px solid ${isActive ? item.color + "30" : "transparent"}`,
        }}>
        {isActive && (
          <motion.div layoutId="sidebar-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
            style={{ backgroundColor: item.color }} />
        )}
        <item.icon
          size={16}
          className="flex-shrink-0"
          style={{ color: isActive ? item.color : "#555" }}
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-xs font-semibold whitespace-nowrap overflow-hidden"
              style={{ color: isActive ? "#fff" : "#666" }}>
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-ink-700 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            {item.label}
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-ink-800 border border-white/10 text-ink-300"
        onClick={() => setMobileOpen(o => !o)}>
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 56 : 200 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`
          h-screen bg-ink-800/95 border-r border-white/5 flex flex-col overflow-hidden
          fixed md:relative z-40
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform md:transition-none
        `}
        style={{ backdropFilter: "blur(12px)" }}>

        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #ff4d6d, #c0392b)" }}>
            <Terminal size={13} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="font-display text-sm tracking-widest text-white leading-none">MANGA</p>
                <p className="font-display text-[10px] tracking-widest text-crimson-400 leading-none">MACHINE</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {nav.map(item => <NavItem key={item.id} item={item} />)}
        </nav>

        {/* Collapse toggle + shortcuts hint */}
        <div className="p-2 border-t border-white/5 space-y-1">
          {!collapsed && (
            <div className="px-3 py-1.5">
              <p className="text-[9px] text-ink-600 uppercase tracking-widest font-semibold">Shortcuts</p>
              <p className="text-[9px] text-ink-600 mt-0.5">1-9 navigate · B toggle sidebar</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ink-500 hover:text-ink-300 hover:bg-white/5 transition-all">
            {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
            {!collapsed && <span className="text-[10px] font-semibold">Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
