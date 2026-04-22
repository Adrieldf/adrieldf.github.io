"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scene from "@/components/Scene";

export enum RetroColor {
  Blue = "#3b82f6",
  White = "#ffffff",
  Green = "#22c55e",
  Purple = "#a855f7",
  Pink = "#ec4899",
  Orange = "#f97316",
  Indigo = "#6366f1",
  Cyan = "#06b6d4",
  Red = "#fa5c5c",
}

interface Project {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  image?: string;
  color: RetroColor;
  gameLink?: string;
  sourceLink?: string;
}

const projects: Project[] = [
  {
    id: 0, title: "Cozy Farm",
    desc: "A charming 3D farming experience built with a custom-developed Three.js engine. It features a unique 2.5D rendering system that brings pixel art sprites to life in a 3D world with simulated depth, dynamic shadows, and immersive environment interactions.",
    tags: ["React", "Next.js", "TS", "Three.js", "2D", "3D"], color: RetroColor.Orange,
    image: "/projects/cozy_farm.png",
    gameLink: "https://cozy-farm-phi.vercel.app"
  },
  {
    id: 1, title: "Minecraft Resource Pack Merger",
    desc: "A sophisticated web application designed to merge multiple Minecraft resource packs into a single, optimized ZIP file. It features a modern Minecraft-styled UI, integration with Dropbox for reliable hosting, automatic SHA-1 hash generation, and one-click clipboard copying for easy server configuration setup.",
    tags: ["React", "Next.js", "TS", "Web", "Minecraft", "Tool"], color: RetroColor.Green,
    image: "/projects/mc_resource_pack_merger.png",
    gameLink: "https://adrieldf.github.io/mc-resource-pack-merger/",
    sourceLink: "https://github.com/Adrieldf/mc-resource-pack-merger"
  },
  {
    id: 2, title: "Cyberpunk World",
    desc: "A cyberpunk-themed interactive 3D world map built with Next.js and Three.js. Features an animated ocean shader, GeoJSON landmass projections, and smooth camera controls for orbiting the globe and focusing on specific countries.",
    tags: ["React", "Next.js", "TS", "Web", "Three.js"], color: RetroColor.Indigo,
    image: "/projects/cyberpunk_world.gif",
    gameLink: "https://cyberpunk-world-sigma.vercel.app",
    sourceLink: "https://github.com/Adrieldf/cyberpunk-world"
  },
  {
    id: 3, title: "Movies Pack Opener",
    desc: "A fun web application built with Next.js and React that simulates opening movie-themed mystery packages online. Features dynamic animations and a pack opening experience.",
    tags: ["React", "Next.js", "TS", "Web"], color: RetroColor.Pink,
    image: "/projects/movies_pack_opener.gif",
    gameLink: "https://adrieldf.github.io/movies-pack-opener-app/",
    sourceLink: "https://github.com/Adrieldf/movies-pack-opener-app"
  },
  {
    id: 4, title: "Dino Survival",
    desc: "3D survival game with dinosaurs. The player can collect xp gems to level up and become stronger, battle other dinosaurs and gather power ups to get temporary boosts. Also features an online leaderboard for players to compete for the best score.",
    tags: ["Unity", "C#", "3D", "Mobile"], color: RetroColor.Blue,
    image: "/projects/dino_survival.jpeg",
    sourceLink: "https://github.com/Adrieldf/ProjectDino"
  },
  {
    id: 5, title: "Web Portfolio",
    desc: "A fully responsive and interactive personal portfolio website showcasing my game development and programming journey. Built with Next.js, React, and TypeScript, featuring a dynamic 3D environment powered by Three.js and smooth, retro-inspired UI animations.",
    tags: ["React", "Next.js", "TS", "Web", "Three.js"], color: RetroColor.White,
    image: "/projects/web_portfolio.png",
    sourceLink: "https://github.com/Adrieldf/adrieldf.github.io"
  },
  {
    id: 6, title: "Purrfect Pizza & Fish Delivery",
    desc: "Game made for Ludum Dare 53 Compo (48 hours and from scratch) about a cat that needs to time the deliveries correctly and not fall into holes to score. With 2308 submissions my game got the 337th position overall and the best results were on Humor and Theme with 188th and 203rd respectively.",
    tags: ["Unity", "C#", "2D", "Web", "Game Jam"], color: RetroColor.Green,
    image: "/projects/purrfect_pizza_and_fish_delivery.png",
    gameLink: "https://adrieldf.itch.io/purrfect-pizza-fish-delivery",
    sourceLink: "https://github.com/Adrieldf/ProjectDelivery"
  },
  {
    id: 7, title: "Grapple Against Time",
    desc: "A 2D physics game where the player needs to use a grappling hook to swing through an asteroid field to find oxygen cans that are scattered from the spaceship explosion. This game was made for 3 game jams at the same time, taking into consideration the theme and restrictions of all of them. The overall results were: Mini Jam 130: 22nd position, Gamedev.js Jam: 87th position and Lv.99 Game Jam: 69th position.",
    tags: ["Unity", "C#", "2D", "Web", "Game Jam"], color: RetroColor.Purple,
    image: "/projects/grapple_against_time.png",
    gameLink: "https://adrieldf.itch.io/grapple-against-time",
    sourceLink: "https://github.com/Adrieldf/ProjectLunar"
  },
  {
    id: 8, title: "Game Invaders",
    desc: "A 2D shoot‘em up where the player needs to kill all the “bugs” helping to “publish” a stable game. Inspired by games like Space Invaders and Chicken Invaders. The jam theme was Unstable and the game was made by myself in 72 hours from scratch.",
    tags: ["Unity", "C#", "2D", "Windows", "Game Jam"], color: RetroColor.Pink,
    image: "/projects/game_invaders.png",
    gameLink: "https://adrieldf.itch.io/game-invaders",
    sourceLink: "https://github.com/Adrieldf/LudumDare49"
  },
  {
    id: 9, title: "Bob, The Robot",
    desc: "A 2D platform game created together with a friend where we did all the assets, design and code. The jam theme was Rewind and the main mechanic of the game is to rewind time to solve the puzzles and progress through the game.",
    tags: ["Unity", "C#", "2D", "Windows", "Game Jam"], color: RetroColor.Orange,
    image: "/projects/bob_the_robot.png",
    gameLink: "https://adrieldf.itch.io/bob-the-robot",
    sourceLink: "https://github.com/Adrieldf/ProjectRewind"
  },
  {
    id: 10, title: "Cactus Care",
    desc: "A 2D clicker game where the player can grow cacti plants to progress through the game and farm points. I’ve released this game a while ago on Google Play Store but with the recent policy changes it has become obsolete and it’s not available to download anymore through the store.",
    tags: ["Unity", "C#", "2D", "Mobile"], color: RetroColor.Cyan,
    image: "/projects/cactus_care.png",
    gameLink: "https://apkpure.com/br/cactus-care/com.adrielgames.cactuscare",
  },
  {
    id: 11, title: "Rock Paper Scissors Lies",
    desc: "Game created for the international Community Game Jam with the theme The game is a liar in a 7-day duration. Available in web and Windows versions, the game is about rock-paper-scissors battles where the computer gives you hints that are mostly lies, and your goal is to win as many times as possible against your enemy. It features retro graphics and music, both created entirely by me during the jam.",
    tags: ["Unity", "C#", "2D", "Web", "Game Jam"], color: RetroColor.Red,
    image: "/projects/rock_paper_scissors_lies.png",
    gameLink: "https://adrieldf.itch.io/rock-paper-scissors-lies",
    sourceLink: "https://github.com/Adrieldf/CommunityJam19"
  },
  {
    id: 12, title: "SkyRunner",
    desc: "A 3D infinite runner game where the player is an astronaut that runs on platforms from falling meteors and can collect coins to unlock new cosmetic items. The objective is to get as far as possible to become the number one rank on the global leaderboard. I’ve released this game a while ago on Google Play Store but with the recent policy changes it has become obsolete and it’s not available to download anymore through the store.",
    tags: ["Unity", "C#", "3D", "Mobile"], color: RetroColor.Blue,
    image: "/projects/skyrunner.png",
    gameLink: "https://apkpure.com/br/skyrunner/com.adrielgames.skyrunner",

  },
  {
    id: 13, title: "Sam the Slime Slayer",
    desc: " A 2D action survival game where the player slays slimes to survive and choose upgrades that cost health to get stronger after defeating each wave. This game was made for the Ludum Dare 44 with the theme 'Your life is currency'. ",
    tags: ["Unity", "C#", "2D", "Web", "Game Jam"], color: RetroColor.White,
    image: "/projects/sam_the_slime_slayer.png",
    gameLink: "https://adrieldf.itch.io/sam-the-slime-slayer",
    sourceLink: "https://github.com/Adrieldf/LudumDare44"

  },
  {
    id: 14, title: "Run Cockroach Run",
    desc: "A 2D infinite runner game made for the Two Button Game Jam where the whole game (and menus) needed to be playable using only two buttons. ",
    tags: ["Unity", "C#", "2D", "Web", "Game Jam"], color: RetroColor.Green,
    image: "/projects/run_cockroach_run.png",
    gameLink: "https://adrieldf.itch.io/run-cockroach-run",
    sourceLink: "https://github.com/patrickprz/2btngamejam"
  }
];

const allTags: string[] = ["All", ...Array.from(new Set(projects.flatMap(p => p.tags))).sort()];

export function ProjectImage({ project, theme }: { project: Project, theme: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderImage = project.image?.replace(/\.[^/.]+$/, "") + "_low.jpg";

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div
      className={`border-2 md:border-4 mb-4 md:mb-6 overflow-hidden relative ${theme === "cyberpunk" ? "cyberpunk-border" : ""}`}
      style={{ borderColor: theme === "retro" ? project.color : "#ff003c" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={project.image}
        alt={`${project.title} preview`}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto block transition-opacity duration-300 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Fallback/Loading background to prevent collapse */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}
    </div>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<string>("All");
  const [isCRT, setIsCRT] = useState<boolean>(false);
  const [isGlitch, setIsGlitch] = useState<boolean>(false);
  const [theme, setTheme] = useState<"retro" | "cyberpunk">("retro");

  useEffect(() => {
    const day = new Date().getDate();
    setTheme(day % 2 === 0 ? "retro" : "cyberpunk");
  }, []);

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.tags.includes(filter));

  const toggleTheme = () => {
    setTheme(theme === "retro" ? "cyberpunk" : "retro");
    setIsCRT(false);
    setIsGlitch(false);
  };

  return (
    <main className="min-h-screen text-white p-4 md:p-8 relative overflow-x-hidden uppercase tracking-wider">
      {isCRT && theme === "retro" && <div className="scanlines"></div>}
      {theme === "cyberpunk" && <div className="cyberpunk-vignette"></div>}
      {isGlitch && theme === "cyberpunk" && <div className="glitch-overlay"></div>}
      <Scene activeTag={filter} isGlitch={isGlitch && theme === "cyberpunk"} theme={theme} />

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {/* TV Toggle (Retro) or Glitch Toggle (Cyberpunk) */}
        {theme === "retro" ? (
          <button
            onClick={() => setIsCRT(!isCRT)}
            className={`p-2 border-2 retro-shadow transition-colors flex items-center justify-center ${isCRT ? "text-indigo-400 border-indigo-400" : "text-slate-400 border-slate-600 hover:text-white hover:border-white"
              }`}
            title="Toggle CRT Effect"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="2" y="7" width="20" height="15" />
              <polyline points="17 2 12 7 7 2" />
              <line x1="6" y1="14" x2="18" y2="14" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setIsGlitch(!isGlitch)}
            className={`p-2 border-2 transition-all flex items-center justify-center cyberpunk-button ${isGlitch ? "bg-[#00f0ff] text-black" : "bg-[#fcee0a] text-black"}`}
            title="Toggle Glitch Effect"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 80% 100%, 0 100%)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </button>
        )}

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className={`p-2 border-2 transition-all flex items-center justify-center ${theme === "retro"
            ? "text-slate-400 border-slate-600 hover:text-white hover:border-white retro-shadow"
            : "bg-[#fcee0a] border-[#fcee0a] text-black hover:bg-[#00f0ff] hover:border-[#00f0ff]"
            }`}
          title="Switch Style"
          style={theme === "cyberpunk" ? { clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)" } : {}}
        >
          {theme === "retro" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>

      {/* Header com estilo Retro/Cyberpunk */}
      <header
        className="mb-12 mt-6 relative z-10 text-center md:text-left transition-all"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-2xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight ${theme === "retro"
            ? "text-indigo-400 drop-shadow-[3px_3px_0_#fff]"
            : "text-[#fcee0a] glitch-text"
            }`}
          style={theme === "cyberpunk" ? { textShadow: "3px 3px #ff003c, -2px -2px #00f0ff" } : {}}
        >
          ADRIEL IZOTON DE FACI
        </motion.h1>
        <p
          className={`font-bold tracking-widest text-xs md:text-sm lg:text-base transition-all ${theme === "retro"
            ? "text-white drop-shadow-[2px_2px_0_#6366f1]"
            : "text-[#fcee0a] inline-block px-2 border-l-4 border-[#ff003c]"
            }`}
        >
          &gt; GAME DESIGNER & DEVELOPER _
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
          {[
            { name: "LinkedIn", url: "https://www.linkedin.com/in/adrieldf/", color: "border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c]", icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /> },
            { name: "GitHub", url: "https://github.com/Adrieldf", color: "border-[#fcee0a] text-[#fcee0a] hover:bg-[#fcee0a]", icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /> },
            {
              name: "Itch.io", url: "https://adrieldf.itch.io", color: "border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]", icon: <>
                <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
                <line x1="6" y1="12" x2="10" y2="12" />
                <line x1="8" y1="10" x2="8" y2="14" />
                <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
                <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
              </>
            },
            {
              name: "E-mail", url: "mailto:adriel.idf@gmail.com", color: "border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c]", icon: <>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </>
            },
          ].map((link, i) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 px-3 py-2 border-2 text-[8px] md:text-[10px] font-bold uppercase transition-all group ${theme === "retro" ? "border-indigo-500 text-indigo-400 retro-shadow hover:text-white hover:border-white" : `${link.color} hover:text-black`}`}
              style={{
                clipPath: theme === "cyberpunk" ? "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" : "none"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={link.name === "LinkedIn" || link.name === "GitHub" ? "currentColor" : "none"} stroke={link.name === "LinkedIn" || link.name === "GitHub" ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="group-hover:animate-pulse">
                {link.icon}
              </svg>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </header>

      {/* Filtros Retro/Cyberpunk */}
      <nav className="flex flex-wrap gap-3 mb-12 relative z-10 justify-center md:justify-start transition-all">
        {allTags.map((tag, i) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-3 py-2 border-2 md:border-4 text-[8px] md:text-xs font-bold uppercase transition-all ${theme === "retro"
              ? `retro-shadow ${filter === tag ? "border-indigo-400 text-indigo-400" : "border-white text-white hover:text-indigo-200"}`
              : `${filter === tag ? "border-[#ff003c] text-[#ff003c] shadow-[0_0_10px_#ff003c]" : "border-[#fcee0a] text-[#fcee0a] hover:bg-[#fcee0a] hover:text-black"}`
              }`}
            style={{
              clipPath: theme === "cyberpunk" ? "polygon(0 0, 100% 0, 100% 70%, 80% 100%, 0 100%)" : "none"
            }}
          >
            {tag}
          </button>
        ))}
      </nav>

      {/* Grid de Projetos Retro */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 relative z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`group border-2 md:border-4 flex flex-col h-full transition-all ${theme === "retro" ? "retro-shadow border-white" : "border-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.2)]"}`}
              style={{
                borderColor: theme === "retro" ? project.color : "#ff003c"
              }}
            >
              <div className="p-3 md:p-4 flex flex-col h-full">
                {project.image && (
                  <ProjectImage project={project} theme={theme} />
                )}

                <h3
                  className={`text-base md:text-lg font-bold mb-2 md:mb-4 uppercase transition-colors ${theme === "retro" ? "drop-shadow-[1px_1px_0_#fff]" : ""}`}
                  style={{ color: theme === "retro" ? project.color : "#fcee0a" }}
                >
                  {project.title}
                </h3>
                <p className={`text-[8px] md:text-[10px] lg:text-xs mb-4 md:mb-6 flex-grow leading-relaxed uppercase transition-colors ${theme === "retro" ? "text-slate-300" : "text-[#00f0ff]"}`}>
                  {project.desc}
                </p>

                {(project.gameLink || project.sourceLink) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.gameLink && (
                      <a
                        href={project.gameLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex-1 text-center px-2 py-1 border-2 text-[8px] md:text-[10px] font-bold uppercase transition-all ${theme === "retro" ? "retro-shadow hover:bg-slate-800" : "hover:bg-[#ff003c] hover:text-black"}`}
                        style={{
                          borderColor: theme === "retro" ? project.color : "#ff003c",
                          color: theme === "retro" ? project.color : "#ff003c",
                          clipPath: theme === "cyberpunk" ? "polygon(0 0, 100% 0, 100% 70%, 80% 100%, 0 100%)" : "none"
                        }}
                      >
                        View Project
                      </a>
                    )}
                    {project.sourceLink && (
                      <a
                        href={project.sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex-1 text-center px-2 py-1 border-2 text-[8px] md:text-[10px] font-bold uppercase transition-all ${theme === "retro" ? "retro-shadow hover:bg-slate-800" : "hover:bg-[#00f0ff] hover:text-black"}`}
                        style={{
                          borderColor: theme === "retro" ? project.color : "#00f0ff",
                          color: theme === "retro" ? project.color : "#00f0ff",
                          clipPath: theme === "cyberpunk" ? "polygon(0 0, 100% 0, 100% 70%, 80% 100%, 0 100%)" : "none"
                        }}
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {[...project.tags].sort().map(t => (
                    <span
                      key={t}
                      className={`px-1.5 py-0.5 md:px-2 md:py-1 border-[1px] md:border-2 text-[6px] md:text-[8px] font-bold uppercase transition-colors`}
                      style={{
                        borderColor: theme === "retro" ? project.color : "#ff003c",
                        color: theme === "retro" ? project.color : "#ff003c",
                        clipPath: theme === "cyberpunk" ? "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" : "none"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
