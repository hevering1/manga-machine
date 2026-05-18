"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Layers, Zap, FileText, TrendingUp, Clock,
  ChevronRight, Flame, Sparkles, Plus, RefreshCw, Star,
  CheckCircle, Edit3, Globe, Users
} from "lucide-react";

interface Stats {
  libraryCount: number;
  biblesCount: number;
  chaptersCount: number;
  completeCount: number;
}

interface RecentItem {
  id: string;
  type: "bible" | "chapter" | "library";
  title: string;
  subtitle: string;
  time: string;
  status?: string;
}

function StatCard({ label, value, icon: Icon, color, change, onClick }: any) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} onClick={onClick}
      className="bg-ink-800/60 border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-white/15 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-8 translate-x-8"
        style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {change && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
            {change}
          </span>
        )}
      </div>
      <div className="font-display text-3xl tracking-wider mb-0.5" style={{ color }}>{value}</div>
      <div className="text-ink-300 text-xs">{label}</div>
    </motion.div>
  );
}

function ActivityItem({ item }: { item: RecentItem }) {
  const icons: Record<string, any> = { bible: Sparkles, chapter: FileText, library: BookOpen };
  const colors: Record<string, string> = { bible: "#ff4d6d", chapter: "#00d4ff", library: "#ffd700" };
  const Icon = icons[item.type];
  const color = colors[item.type];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={12} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{item.title}</p>
        <p className="text-ink-400 text-[10px] mt-0.5">{item.subtitle}</p>
      </div>
      <div className="text-ink-500 text-[10px] flex-shrink-0">{item.time}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color, onClick }: any) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 hover:border-white/15 bg-ink-800/40 transition-all group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={18} style={{ color }} className="group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-[10px] font-semibold text-ink-300 text-center leading-tight">{label}</span>
    </motion.button>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard({ setActive }: { setActive: (s: string) => void }) {
  const [stats, setStats] = useState<Stats>({ libraryCount: 0, biblesCount: 0, chaptersCount: 0, completeCount: 0 });
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [libRes, bibleRes, chapterRes] = await Promise.all([
          fetch("/api/library"),
          fetch("/api/bibles"),
          fetch("/api/chapters"),
        ]);
        const [libData, bibleData, chapterData] = await Promise.all([
          libRes.json(), bibleRes.json(), chapterRes.json()
        ]);

        const library = libData.series || [];
        const bibles = bibleData.bibles || [];
        const chapters = chapterData.chapters || [];

        setStats({
          libraryCount: library.length,
          biblesCount: bibles.length,
          chaptersCount: chapters.length,
          completeCount: bibles.filter((b: any) => b.status === "Production").length,
        });

        // Build recent activity
        const items: RecentItem[] = [
          ...bibles.slice(0, 4).map((b: any) => ({
            id: b.id, type: "bible" as const,
            title: b.series_title || "Untitled Bible",
            subtitle: `Story Bible · ${b.status || "Draft"}`,
            time: timeAgo(b.created_date),
            status: b.status,
          })),
          ...chapters.slice(0, 3).map((c: any) => ({
            id: c.id, type: "chapter" as const,
            title: c.chapter_title || `Chapter ${c.chapter_number}`,
            subtitle: `${c.series_title || "Unknown Series"} · Ch.${c.chapter_number}`,
            time: timeAgo(c.created_date),
          })),
          ...library.slice(0, 3).map((l: any) => ({
            id: l.id, type: "library" as const,
            title: l.title,
            subtitle: `${l.type || "Manga"} · Added to library`,
            time: timeAgo(l.created_date),
          })),
        ].sort((a, b) => 0).slice(0, 8);

        setRecent(items);
      } catch {}
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { icon: Sparkles, label: "New Bible", color: "#ff4d6d", page: "engine" },
    { icon: BookOpen, label: "Add Series", color: "#ffd700", page: "library" },
    { icon: Users, label: "Characters", color: "#a855f7", page: "characters" },
    { icon: Globe, label: "World Builder", color: "#00d4ff", page: "world" },
    { icon: Zap, label: "Power System", color: "#10b981", page: "power" },
    { icon: FileText, label: "Chapter Vault", color: "#f59e0b", page: "vault" },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Flame className="text-crimson-400" size={22} />
          <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gradient-red">MANGA MACHINE</h1>
        </div>
        <p className="text-ink-300 text-sm">Your AI-powered manga studio. Build the next 1000-chapter epic.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Reference Series" value={loading ? "—" : stats.libraryCount} icon={BookOpen} color="#ffd700"
          onClick={() => setActive("library")} />
        <StatCard label="Story Bibles" value={loading ? "—" : stats.biblesCount} icon={Sparkles} color="#ff4d6d"
          onClick={() => setActive("series")} />
        <StatCard label="Chapter Scripts" value={loading ? "—" : stats.chaptersCount} icon={FileText} color="#00d4ff"
          onClick={() => setActive("vault")} />
        <StatCard label="In Production" value={loading ? "—" : stats.completeCount} icon={CheckCircle} color="#10b981"
          onClick={() => setActive("series")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg tracking-widest text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-crimson-400" /> QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {quickActions.map(a => (
              <QuickAction key={a.page} icon={a.icon} label={a.label} color={a.color}
                onClick={() => setActive(a.page)} />
            ))}
          </div>

          {/* Featured CTA */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setActive("engine")}
            className="relative overflow-hidden rounded-2xl cursor-pointer border border-crimson-500/20 p-6"
            style={{ background: "linear-gradient(135deg, rgba(255,77,109,0.12), rgba(192,57,43,0.06))" }}>
            <div className="absolute inset-0 speed-line-bg opacity-30" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-crimson-400" />
                  <span className="text-crimson-400 text-xs font-semibold uppercase tracking-widest">Story Engine</span>
                </div>
                <h3 className="font-display text-2xl tracking-wider text-white mb-1">Generate New Series Bible</h3>
                <p className="text-ink-300 text-sm">Pick your genre, tone & power system. Get a full series bible in seconds.</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,77,109,0.2)", border: "1px solid rgba(255,77,109,0.4)" }}>
                <ChevronRight size={20} className="text-crimson-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-display text-lg tracking-widest text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-ink-300" /> RECENT ACTIVITY
          </h2>
          <div className="bg-ink-800/60 border border-white/5 rounded-2xl p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw size={16} className="text-ink-500" />
                </motion.div>
              </div>
            ) : recent.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-ink-500 text-sm">No activity yet.</p>
                <button onClick={() => setActive("engine")}
                  className="mt-3 text-xs text-crimson-400 hover:text-crimson-300 transition-colors">
                  Generate your first bible →
                </button>
              </div>
            ) : (
              <div>
                {recent.map(item => <ActivityItem key={item.id} item={item} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
