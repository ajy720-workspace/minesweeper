import Game from '@/components/game/Game';
import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Hero Logo Section */}
      <Game session={session} />
      <div className="text-center py-6">
        <p className="text-muted-foreground text-sm sm:text-base max mx-auto">
          Clear the minefield by revealing all safe cells. Flag the mines and use logic to win!
        </p>
      </div>
    </div>
  );
}
