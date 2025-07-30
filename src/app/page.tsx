import Board from "@/components/game/Board";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Minesweeper</h1>
      <Board />
    </div>
  );
}