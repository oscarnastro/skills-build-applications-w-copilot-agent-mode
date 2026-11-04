import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Entry = { teamName: string; totalPoints: number; rank: number };

function loadLeaderboard() {
  return getJson<{ leaderboard: Entry[] }>('/api/leaderboard');
}

export default function Leaderboard() {
  return <CapabilityCard<Entry>
    title="Leaderboard"
    description="Compare team point totals."
    loadData={loadLeaderboard}
    collectionKey="leaderboard"
    emptyMessage="No leaderboard scores yet."
    itemKey={(entry) => entry.rank}
    renderItem={(entry) => <>{entry.rank}. {entry.teamName} · {entry.totalPoints} points</>}
  />;
}
