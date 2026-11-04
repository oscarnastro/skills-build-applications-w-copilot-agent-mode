import { CapabilityCard } from './CapabilityCard.js';

type Entry = { teamName: string; totalPoints: number; rank: number };

export default function Leaderboard() {
  return <CapabilityCard<Entry>
    title="Leaderboard"
    description="Compare team point totals."
    path="/api/leaderboard"
    collectionKey="leaderboard"
    emptyMessage="No leaderboard scores yet."
    itemKey={(entry) => entry.rank}
    renderItem={(entry) => <>{entry.rank}. {entry.teamName} · {entry.totalPoints} points</>}
  />;
}
