import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Team = { _id?: string; name: string; mascot?: string; members: unknown[] };

function loadTeams() {
  return getJson<{ teams: Team[] }>('/api/teams');
}

export default function Teams() {
  return <CapabilityCard<Team>
    title="Teams"
    description="Manage teams and members."
    loadData={loadTeams}
    collectionKey="teams"
    emptyMessage="No teams yet."
    itemKey={(team, index) => team._id ?? index}
    renderItem={(team) => <>{team.name}{team.mascot ? ` · ${team.mascot}` : ''} · {team.members.length} members</>}
  />;
}
