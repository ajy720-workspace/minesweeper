import Game from '@/components/game/Game';
import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div>
      <Game session={session} />
    </div>
  );
}
