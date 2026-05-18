"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, Star, TrendingUp, ChevronDown, X, Tag } from "lucide-react";

const mockSeries = [
  {
    id: 1, title: "One Piece", type: "Manga", genre: "Shonen Adventure", status: "Complete",
    author: "Eiichiro Oda", origin: "Japan", tone: "Epic/Comedic",
    protagonist: "Underdog Chosen One", antagonist: "System/Empire",
    power_system: "Devil Fruits + Haki — tiered ability system with rare overpowered fruits",
    world: "Grand Line — vast ocean world with islands as self-contained story arcs",
    what_made_it_great: "Emotional payoffs, world consistency, crew dynamics, villain complexity",
    virality: ["Memorable power reveals", "Long-form emotional payoffs", "Iconic villain introductions"],
    tags: ["Pirates", "Adventure", "Found Family", "Long-form"],
    rating: 5, research_status: "Complete"
  },
  {
    id: 2, title: "Solo Leveling", type: "Manhwa", genre: "Action Fantasy", status: "Complete",
    author: "Chugong", origin: "Korea", tone: "Dark/Power Fantasy",
    protagonist: "Weakest to Strongest", antagonist: "Ancient Evil",
    power_system: "Level-up RPG system — numeric stats, dungeons, shadow army necromancy",
    world: "Modern Korea with hidden gate portals to monster dimensions",
    what_made_it_great: "Power fantasy fulfillment, gorgeous art escalation, clean pacing",
    virality: ["Power-up moments", "Shadow army reveals", "Boss fight sequences"],
    tags: ["Power Fantasy", "RPG System", "Hunter", "Modern Fantasy"],
    rating: 5, research_status: "Complete"
  },
];

const genreColors: Record<string, string> = {
  "Manga": "#ff4d6d",
  "Manhwa": "#00d4ff",
  "Manhua": "#ffd700",
  "Webtoon": "#a855f7",
};

export default function ReferenceLibrary() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof mockSeries[0] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = mockSeries.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.genre.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-widest text-gradient-red">REFERENCE LIBRARY</h1>
          <p className="text-ink-300 text-sm mt-1">Deconstruct the greats. Build something greater.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-pill bg-gold-500/10 text-gold-400 border border-gold-500/20">
            {mockSeries.length} Series
          </span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search series, genre, tags..."
            className="w-full pl-10 pr-4 py-3 bg-ink-700 border border-white/10 rounded-xl text-white placeholder-ink-400 text-sm focus:outline-none focus:border-crimson-500 transition-colors"
          />
        </div>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="px-4 py-3 rounded-xl bg-ink-700 border border-white/10 text-ink-200 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <Filter size={15} /> Filter <ChevronDown size={14} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((series, i) => (
          <motion.div
            key={series.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelected(series)}
            className="card-hover cursor-pointer rounded-xl bg-ink-700 border border-white/5 overflow-hidden group"
          >
            {/* Top color bar */}
            <div className="h-1 w-full" style={{ backgroundColor: genreColors[series.type] || "#ff4d6d" }} />
            
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-pill text-[10px]" style={{
                      backgroundColor: `${genreColors[series.type]}15`,
                      color: genreColors[series.type],
                      border: `1px solid ${genreColors[series.type]}30`
                    }}>
                      {series.type}
                    </span>
                    <span className="badge-pill bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                      {series.research_status}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl tracking-wider text-white group-hover:text-crimson-400 transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-xs text-ink-300">{series.author} · {series.origin}</p>
                </div>
                <div className="flex">
                  {[...Array(series.rating)].map((_, j) => (
                    <Star key={j} size={12} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-ink-300 mb-3 line-clamp-2">{series.power_system}</p>

              <div className="flex flex-wrap gap-1">
                {series.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="badge-pill bg-white/5 text-ink-200 border border-white/8 text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filtered.length * 0.08 }}
          className="rounded-xl border-2 border-dashed border-white/10 hover:border-crimson-500/40 transition-colors p-5 flex flex-col items-center justify-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-ink-600 group-hover:bg-crimson-600/20 flex items-center justify-center transition-colors">
            <BookOpen size={18} className="text-ink-300 group-hover:text-crimson-400" />
          </div>
          <span className="text-sm text-ink-300 group-hover:text-white transition-colors">Add Series</span>
          <span className="text-xs text-ink-500 text-center">Email with "add: Series Name"<br/>or drop it here</span>
        </motion.div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-ink-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="h-1 w-full rounded-t-2xl" style={{ backgroundColor: genreColors[selected.type] || "#ff4d6d" }} />
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-display text-4xl tracking-widest text-white">{selected.title}</h2>
                    <p className="text-ink-300">{selected.author} · {selected.origin} · {selected.type}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "⚡ Power System", value: selected.power_system },
                    { label: "🌍 World Building", value: selected.world },
                    { label: "👤 Protagonist", value: selected.protagonist },
                    { label: "😈 Antagonist", value: selected.antagonist },
                    { label: "✨ What Made It Great", value: selected.what_made_it_great },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl bg-white/3 border border-white/5 p-4">
                      <div className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">{item.label}</div>
                      <p className="text-sm text-white">{item.value}</p>
                    </div>
                  ))}

                  <div className="rounded-xl bg-crimson-600/10 border border-crimson-600/20 p-4">
                    <div className="text-xs font-semibold text-crimson-400 uppercase tracking-wider mb-2">🔥 Virality Factors</div>
                    <div className="space-y-1">
                      {selected.virality.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white">
                          <TrendingUp size={12} className="text-crimson-400" /> {v}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map(tag => (
                      <span key={tag} className="badge-pill bg-gold-500/10 text-gold-400 border border-gold-500/20">
                        <Tag size={10} className="mr-1" />{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
