import {getDB} from "../database/database.js";
import type {Superset, TrackedWorkout, WorkoutSet} from "../types/types.js";

export async function getUserData(username: string) {
    const db = getDB();
    const user = await db.get(`SELECT name, email FROM accounts WHERE username = ?`, [username]);
    return { name: user?.name, email: user?.email, username };
}

export async function updateUserData(username: string, name: string, email: string) {
    const db = getDB();
    await db.run(`UPDATE accounts SET name = ?, email = ? WHERE username = ?`, [name, email, username])
}

export async function saveWorkout(userId: number, workout: TrackedWorkout) {
    const db = getDB();
    const result = await db.run(`INSERT INTO lifts (user_id, type, date, duration_minutes) VALUES (?, ?, ?, ?)`, [userId, workout.type, new Date(workout.date).toISOString(), workout.workout_length_minutes]);

    const workoutId = result.lastID;

    for (let i = 0; i < workout.lifts.length; i++) {
        const lift = workout.lifts[i];

        if (!lift) continue;
        const exerciseResult = await db.run(`INSERT INTO exercises (workout_id, exercise_id, exercise_order) VALUES (?, ?, ?)`, [workoutId, lift.exercise_id, i]);
        const workoutExerciseId = exerciseResult.lastID;

        for (let j = 0; j < lift.set.length; j++) {
            const set = lift.set[j];

            if (set === undefined) continue;
            const setResult = await db.run(`INSERT INTO sets (workout_exercise_id, set_number, weight, reps) VALUES (?, ?, ?, ?)`, [workoutExerciseId, j, set.weight, set.reps]);
            const setId = setResult.lastID;

            if (set.superset) {
                for (const superset of set.superset) {
                    await db.run(`INSERT INTO supersets (parent_set_id, exercise_id, weight,reps) VALUES (?, ?, ?, ?) `, [setId, superset.exercise_id, superset.weight, superset.reps]);
                }
            }
        }
    }
}

export async function getLastWorkoutSets(userId: number, exerciseId: string) {
    const db = getDB();
    const workout = await db.get<{ id: number }>(`
        SELECT w.id FROM lifts w
        JOIN exercises we ON we.workout_id = w.id
        WHERE w.user_id = ? AND we.exercise_id = ?
        ORDER BY w.date DESC
        LIMIT 1
        `, [userId, exerciseId]
    );

    if (!workout) return undefined;

    const exercise = await db.get<{ id: number }>(`
        SELECT id FROM exercises
        WHERE workout_id = ? AND exercise_id = ?
        LIMIT 1
        `, [workout.id, exerciseId]
    );

    if (!exercise) return undefined;

    const sets = await db.all<{ id: number; weight: number; reps: number; }[]>(
        `
        SELECT id, weight, reps FROM sets
        WHERE workout_exercise_id = ?
        ORDER BY set_number
        `, [exercise.id]
    );

    // 4. attach supersets
    const result: WorkoutSet[] = [];

    for (const set of sets) {
        const supers = await db.all<Superset[]>(`
            SELECT exercise_id, weight, reps FROM supersets
            WHERE parent_set_id = ?
            `, [set.id]
        );

        const workoutSet: WorkoutSet = {weight: set.weight, reps: set.reps};
        if (supers.length > 0) workoutSet.superset = supers;
        result.push(workoutSet);
    }

    return result;
}

export async function getPR(userId: number, exerciseId: string) {
    const db = getDB();
    const bestSet = await db.get<{ id: number; weight: number; reps: number; }>(
        `
        SELECT ws.id, ws.weight, ws.reps FROM sets ws
        JOIN exercises we ON we.id = ws.workout_exercise_id
        JOIN lifts w ON w.id = we.workout_id
        WHERE w.user_id = ? AND we.exercise_id = ?
        ORDER BY ws.weight DESC, ws.reps DESC
        LIMIT 1
        `, [userId, exerciseId]
    );

    if (!bestSet) return undefined;

    const supers = await db.all<Superset[]>(
        `
        SELECT exercise_id, weight, reps FROM supersets
        WHERE parent_set_id = ?
        `, [bestSet.id]
    );

    return {
        weight: bestSet.weight,
        reps: bestSet.reps,
        superset: supers.length ? supers : undefined
    };
}

export async function getExerciseHistory(userId: number, exerciseId: string) {
    const db = getDB();
    return await db.all(`
        SELECT ws.weight, ws.reps, w.date
        FROM sets ws
        JOIN exercises we ON ws.workout_exercise_id = we.id
        JOIN lifts w ON we.workout_id = w.id
        WHERE w.user_id = ?
        AND we.exercise_id = ?
        ORDER BY w.date
        `, [userId, exerciseId]
    );
}