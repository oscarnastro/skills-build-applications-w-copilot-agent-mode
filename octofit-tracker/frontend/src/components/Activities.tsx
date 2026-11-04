import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Activity = { _id?: string; type: string; minutes: number; points: number };

function loadActivities() {
  return getJson<{ activities: Activity[] }>('/api/activities');
}

export default function Activities() {
  return <CapabilityCard<Activity>
    title="Activities"
    description="Track student activity minutes and points."
    loadData={loadActivities}
    collectionKey="activities"
    emptyMessage="No activities yet."
    itemKey={(activity, index) => activity._id ?? index}
    renderItem={(activity) => <>{activity.type} · {activity.minutes} min · {activity.points} points</>}
  />;
}
