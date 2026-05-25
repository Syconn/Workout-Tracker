export const URL = import.meta.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export type ExerciseDB = {
    name: string;
    force: string;
    level: string;
    mechanic: string;
    equipment: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    instructions: string[];
    category: string;
    images: string[];
};

export type TrackedWorkout = {
    type: string;
    date: Date | string;
    workout_length_minutes: number;
    lifts: Lift[]
}

export type Lift = {
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

export const Pages = {
    Main: "/",
    AccountManager: "/account",
    Home: "/home",
    ProfilePage: "/profile",
    TrackerPage: "tracker",
    StartPage: "start",
    TrackPage: "track",
    LoginPage: "login",
    SearchPage: "search",
    RegisterPage: "register",
    ForgotPage: "forgot",
}

export const NoWorkout: TrackedWorkout = {
    date: new Date(0, 0, 0),
    lifts: [],
    type: "",
    workout_length_minutes: 0,
}

export const Muscles= ['abdominals', 'hamstrings', 'calves', 'shoulders', 'adductors', 'glutes', 'quadriceps', 'biceps', 'forearms', 'abductors', 'triceps', 'chest', 'lower back', 'traps', 'middle back', 'lats', 'neck']
export const MuscleGroups = {
    Legs: ['hamstrings', 'calves', 'adductors', 'glutes', 'quadriceps', 'abdominals'],
    Push: ['chest', 'triceps', 'shoulders'],
    Pull: ['lower back', 'traps', 'middle back', 'lats', 'neck', 'biceps', 'forearms'],
    Back: ['lower back', 'traps', 'middle back', 'lats', 'neck'],
    Arms: ['biceps', 'forearms', 'triceps'],
    Chest: ['chest'],
    UpperBody: ['biceps', 'forearms', 'shoulders', 'triceps', 'chest', 'lower back', 'traps', 'middle back', 'lats', 'neck'],
    LowerBody: ['abdominals', 'hamstrings', 'calves', 'abductors', 'adductors', 'glutes', 'quadriceps'],
}