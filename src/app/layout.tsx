import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manga Machine — AI Creative Studio",
  description: "AI-powered manga, manhwa & webtoon production engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
