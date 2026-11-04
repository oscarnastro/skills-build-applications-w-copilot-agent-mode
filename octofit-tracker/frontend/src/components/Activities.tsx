import { CapabilityCard } from './CapabilityCard.js';

type Activity = { _id?: string; type: string; minutes: number; points: number };

export default function Activities() {
  return <CapabilityCard<Activity>
    title="Activities"
    description="Track student activity minutes and points."
    path="/api/activities"
    collectionKey="activities"
    emptyMessage="No activities yet."
    itemKey={(activity, index) => activity._id ?? index}
    renderItem={(activity) => <>{activity.type} · {activity.minutes} min · {activity.points} points</>}
  />;
}
