"use client";

import { GameLoader } from "@/components/game/GameLoader";
import { GameProvider } from "@/components/game/GameContext";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <GameProvider>
        <GameLoader />
      </GameProvider>
    </div>
  );
}