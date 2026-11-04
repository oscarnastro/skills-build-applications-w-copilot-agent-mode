import { Activity, Team, User, Workout } from '../models/index.js';

type InputRecord = Record<string, unknown>;

function inputRecord(input: unknown): InputRecord {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
    ? input as InputRecord
    : {};
}

function httpError(message: string, status: number) {
  return Object.assign(new Error(message), { status });
}

function isObjectId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  const { userId, teamId, type, minutes } = inputRecord(input);
  if (!isObjectId(userId) || !isObjectId(teamId) || typeof type !== 'string' || !type.trim() ||
      typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) {
    throw httpError('A valid user, team, activity type, and positive duration are required', 400);
  }

  const [user, team] = await Promise.all([User.findById(userId), Team.findById(teamId)]);
  if (!user || !team) throw httpError('User or team not found', 404);

  return Activity.create({
    user: user._id,
    team: team._id,
    type: type.trim(),
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  const { name, mascot, members } = inputRecord(input);
  if (typeof name !== 'string' || !name.trim() || typeof mascot !== 'string' || !mascot.trim()) {
    throw httpError('A team name and mascot are required', 400);
  }
  if (members !== undefined && !Array.isArray(members)) {
    throw httpError('Members must be an array of user IDs', 400);
  }

  const memberIds = (members ?? []) as unknown[];
  if (!memberIds.every(isObjectId)) throw httpError('Every member must have a valid user ID', 400);
  if (memberIds.length > 0) {
    const existingUsers = await User.countDocuments({ _id: { $in: memberIds } });
    if (existingUsers !== new Set(memberIds).size) throw httpError('One or more users were not found', 404);
  }

  return Team.create({ name: name.trim(), mascot: mascot.trim(), members: memberIds });
}

export async function getLeaderboard() {
  const [teams, totals] = await Promise.all([
    Team.find().lean(),
    Activity.aggregate<{ _id: unknown; totalPoints: number }>([
      { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    ]),
  ]);
  const pointsByTeam = new Map(totals.map(({ _id, totalPoints }) => [String(_id), totalPoints]));
  return teams
    .map((team) => ({ teamName: team.name, totalPoints: pointsByTeam.get(String(team._id)) ?? 0 }))
    .sort((left, right) => right.totalPoints - left.totalPoints || left.teamName.localeCompare(right.teamName))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail }).lean();
  if (!user) throw httpError('User not found', 404);

  const [activities, workouts] = await Promise.all([
    Activity.find({ user: user._id }).sort({ occurredAt: -1 }).limit(5).lean(),
    Workout.find().lean(),
  ]);
  const focusByActivity: Record<string, string> = {
    run: 'endurance',
    cycle: 'endurance',
    walk: 'mobility',
    strength: 'strength',
    yoga: 'mobility',
  };
  const recentFocus = activities.map(({ type }) => focusByActivity[type.toLowerCase()] ?? type.toLowerCase());
  const goal = user.fitnessGoal.toLowerCase();

  return workouts
    .map((workout) => {
      const focus = workout.focus.toLowerCase();
      const matchesGoal = focus === goal;
      const recentActivity = recentFocus.find((recent) => recent === focus);
      const reason = matchesGoal
        ? `Matches your ${user.fitnessGoal} fitness goal`
        : recentActivity
          ? `Builds on your recent ${recentActivity} activity`
          : `A ${workout.focus} option for balanced training`;
      return { ...workout, reason, score: matchesGoal ? 2 : recentActivity ? 1 : 0 };
    })
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .map(({ score: _score, ...suggestion }) => suggestion);
}

export { User };
