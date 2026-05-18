// src/app/api/references/route.ts
// Static reference library snapshot — no external auth required
import { NextResponse } from "next/server";

const REFERENCES = [
  { id: "6a0b3d047abd185de006afa2", title: "That Time I Got Reincarnated as a Slime", type: "Manga / Anime", genre: ["Fantasy", "Isekai", "Action", "Political"] },
  { id: "6a0b37ea07fe7436448e7306", title: "Star Martial God Technique", type: "Manhua", genre: ["Action", "Martial Arts", "Fantasy", "Cultivation"] },
  { id: "6a0b37ea07fe7436448e7307", title: "The Beginning After The End", type: "Manhwa", genre: ["Action", "Fantasy", "Isekai", "Adventure"] },
  { id: "6a0b37ea07fe7436448e7308", title: "The Devil Butler", type: "Manhua", genre: ["Action", "Revenge", "Romance", "Fantasy"] },
  { id: "6a0b37ea07fe7436448e7309", title: "The Great Mage Returns After 4000 Years", type: "Manhwa", genre: ["Action", "Dark Fantasy", "Revenge", "Magic"] },
  { id: "6a0b37ea07fe7436448e730a", title: "I'm the Max-Level Newbie", type: "Manhwa", genre: ["Action", "Fantasy", "Game", "Tower"] },
  { id: "6a0b37ea07fe7436448e730b", title: "Auto Hunting With My Clones", type: "Manhwa", genre: ["Action", "Fantasy", "Hunter", "Modern"] },
  { id: "6a0b37ea07fe7436448e730c", title: "Tales of Demons and Gods", type: "Manhua", genre: ["Action", "Fantasy", "Cultivation", "Time Travel"] },
  { id: "6a0b37ea07fe7436448e730d", title: "Return of the Disaster-Class Hero", type: "Manhwa", genre: ["Action", "Dark Fantasy", "Revenge", "Hunter"] },
  { id: "6a0b37ea07fe7436448e730e", title: "Omniscient Reader's Viewpoint", type: "Manhwa", genre: ["Action", "Fantasy", "Psychological", "Apocalypse"] },
  { id: "6a0a8282f446b0def04eed19", title: "Naruto", type: "Manga", genre: ["Action", "Adventure", "Shounen", "Ninja"] },
  { id: "6a0a8282f446b0def04eed1a", title: "One Piece", type: "Manga", genre: ["Action", "Adventure", "Fantasy", "Shounen"] },
  { id: "6a0a8282f446b0def04eed1b", title: "Jujutsu Kaisen", type: "Manga", genre: ["Action", "Dark Fantasy", "Supernatural", "Shounen"] },
  { id: "6a0a8282f446b0def04eed1c", title: "Attack on Titan", type: "Manga", genre: ["Dark Fantasy", "Action", "Political", "Psychological"] },
  { id: "6a0a8282f446b0def04eed1d", title: "Berserk", type: "Manga", genre: ["Dark Fantasy", "Action", "Psychological", "Horror"] },
  { id: "6a0a8282f446b0def04eed1e", title: "Demon Slayer", type: "Manga", genre: ["Action", "Supernatural", "Shounen"] },
  { id: "6a0a8282f446b0def04eed1f", title: "Vinland Saga", type: "Manga", genre: ["Historical", "Action", "Philosophical", "Drama"] },
  { id: "6a0a8282f446b0def04eed16", title: "Solo Leveling", type: "Manhwa", genre: ["Action", "Fantasy", "Adventure"] },
  { id: "6a0a8282f446b0def04eed17", title: "Tower of God", type: "Webtoon", genre: ["Action", "Fantasy", "Political", "Mystery"] },
];

export async function GET() {
  return NextResponse.json({ references: REFERENCES });
}
