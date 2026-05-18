"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ReferenceLibrary from "@/components/ReferenceLibrary";
import StoryEngine from "@/components/StoryEngine";
import Characters from "@/components/Characters";
import WorldBuilder from "@/components/WorldBuilder";
import PowerSystems from "@/components/PowerSystems";
import StoryAuditor from "@/components/StoryAuditor";
import ChapterVault from "@/components/ChapterVault";
import ActiveSeries from "@/components/ActiveSeries";
import { Plus, Sparkles, BookOpen, Users, Globe, Zap, X } from "lucide-react";

// ── Toast context ───────────────────────────────────────────────
interface Toast { id: string; message: string; type: "success" | "error" | "info" }

const ToastContext = createContext<{ addToast: (msg: string, type?: Toast["type"]) => void }>({
  addToast: () => {}
});

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-xs"
            style={{
              backgroundColor: t.type === "success" ? "rgba(16,185,129,0.15)" : t.type === "error" ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${t.type === "success" ? "rgba(16,185,129,0.4)" : t.type === "error" ? "rgba(255,77,109,0.4)" : "rgba(255,255,255,0.15)"}`,
              color: t.type === "success" ? "#10b981" : t.type === "error" ? "#ff4d6d" : "#e0e0e0",
              backdropFilter: "blur(12px)",
            }}>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100 transition-opacity ml-1">
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Floating Quick-Add button ───────────────────────────────────
function FloatingButton({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: Sparkles, label: "New Bible",  color: "#ff4d6d", page: "engine" },
    { icon: BookOpen, label: "Add Series", color: "#ffd700", page: "library" },
    { icon: Users,    label: "Characters", color: "#a855f7", page: "characters" },
    { icon: Globe,    label: "World",      color: "#00d4ff", page: "world" },
    { icon: Zap,      label: "Power Sys",  color: "#ffd700", page: "power" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex gap-2 mb-1">
            {actions.map(a => (
              <motion.button
                key={a.page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { onNavigate(a.page); setOpen(false); }}
                className="flex flex-col items-center gap-1"
                title={a.label}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${a.color}20`, border: `1.5px solid ${a.color}60`, backdropFilter: "blur(12px)" }}>
                  <a.icon size={15} style={{ color: a.color }} />
                </div>
                <span className="text-[9px] text-white/60 font-semibold">{a.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
        style={{
          background: open ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #ff4d6d, #c0392b)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
        }}>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={20} className="text-white" />
        </motion.div>
      </motion.button>
    </div>
  );
}

// ── Page map ────────────────────────────────────────────────────
const pageMap: Record<string, React.ComponentType<any>> = {
  dashboard:  Dashboard,
  library:    ReferenceLibrary,
  series:     ActiveSeries,
  characters: Characters,
  world:      WorldBuilder,
  power:      PowerSystems,
  engine:     StoryEngine,
  auditor:    StoryAuditor,
  vault:      ChapterVault,
};

// ── App ─────────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Keyboard shortcuts: G = Story Engine, Escape = Dashboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "g" || e.key === "G") setActive("engine");
      if (e.key === "Escape") setActive("dashboard");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const Component = pageMap[active] || Dashboard;

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex h-screen bg-ink-900 overflow-hidden">
        {/* Scan line effect */}
        <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-crimson-500/10 to-transparent"
            animate={{ y: ["-100vh", "100vh"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <Sidebar active={active} setActive={setActive} />

        <main className="flex-1 overflow-y-auto relative">
          <div className="fixed inset-0 bg-manga-grid bg-[size:40px_40px] opacity-100 pointer-events-none" />
          <div className="fixed inset-0 bg-gradient-to-br from-ink-900 via-ink-900/95 to-ink-800/90 pointer-events-none" />

          <div className="relative z-10 pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}>
                <Component setActive={setActive} addToast={addToast} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <FloatingButton onNavigate={setActive} />
        <ToastContainer toasts={toasts} dismiss={dismissToast} />
      </div>
    </ToastContext.Provider>
  );
}
