export type TrackedWorkout = {
    type: string;
    date: Date | string;
    workout_length_minutes: number;
    lifts: Lift[]
}

type Lift = {
    exercise_id: string;
    set: WorkoutSet[];
}

export type WorkoutSet = {
    weight: number;
    reps: number;
    superset?: Superset[]
}

export type Superset = {
    exercise_id: string;
    weight: number;
    reps: number;
}