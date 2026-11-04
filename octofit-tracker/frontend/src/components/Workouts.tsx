import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Workout = { _id?: string; title: string; focus: string; reason: string };

function loadWorkouts() {
  return getJson<{ suggestions: Workout[] }>(`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`);
}

export default function Workouts() {
  return <CapabilityCard<Workout>
    title="Workout suggestions"
    description="Recommend workouts from activity patterns."
    loadData={loadWorkouts}
    collectionKey="suggestions"
    emptyMessage="No workout suggestions yet."
    itemKey={(workout, index) => workout._id ?? index}
    renderItem={(workout) => <>{workout.title} · {workout.focus} · {workout.reason}</>}
  />;
}
