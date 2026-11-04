import { CapabilityCard } from './CapabilityCard.js';

type Team = { _id?: string; name: string; mascot?: string; members: unknown[] };

export default function Teams() {
  return <CapabilityCard<Team>
    title="Teams"
    description="Manage teams and members."
    path="/api/teams"
    collectionKey="teams"
    emptyMessage="No teams yet."
    itemKey={(team, index) => team._id ?? index}
    renderItem={(team) => <>{team.name}{team.mascot ? ` · ${team.mascot}` : ''} · {team.members.length} members</>}
  />;
}
