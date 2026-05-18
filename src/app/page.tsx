"use client";
import { useState } from "react";
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

const pageMap: Record<string, React.ComponentType<any>> = {
  dashboard: Dashboard,
  library: ReferenceLibrary,
  series: ActiveSeries,
  characters: Characters,
  world: WorldBuilder,
  power: PowerSystems,
  engine: StoryEngine,
  auditor: StoryAuditor,
  vault: ChapterVault,
};

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const Component = pageMap[active] || Dashboard;

  return (
    <div className="flex h-screen bg-ink-900 overflow-hidden">
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-crimson-500/10 to-transparent"
          animate={{ y: ["-100vh", "100vh"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 overflow-y-auto relative">
        {/* Background texture */}
        <div className="fixed inset-0 bg-manga-grid bg-[size:40px_40px] opacity-100 pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-ink-900 via-ink-900/95 to-ink-800/90 pointer-events-none" />
        
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Component setActive={setActive} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
