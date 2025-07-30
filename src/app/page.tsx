import Game from "@/components/game/Game";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8">
      <h1 className="text-5xl font-bold mb-6">Minesweeper</h1>
      <Game />
    </div>
  );
}