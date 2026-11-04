import { CapabilityCard } from './CapabilityCard.js';

type Workout = { _id?: string; title: string; focus: string; reason: string };

export default function Workouts() {
  return <CapabilityCard<Workout>
    title="Workout suggestions"
    description="Recommend workouts from activity patterns."
    path={`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`}
    collectionKey="suggestions"
    emptyMessage="No workout suggestions yet."
    itemKey={(workout, index) => workout._id ?? index}
    renderItem={(workout) => <>{workout.title} · {workout.focus} · {workout.reason}</>}
  />;
}
