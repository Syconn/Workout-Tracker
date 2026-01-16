import {AccountData} from "../pages/accounts/AccountManager.tsx";
import {TrackedWorkout} from "../pages/tracker/Tracker.tsx";

export const Pages = {
    HomePage: "/",
    ProfilePage: "/profile",
    AccountManager: "/account",
    TrackerPage: "/tracker",
    StartPage: "start",
    TrackPage: "track",
    LoginPage: "login",
    SearchPage: "search",
    RegisterPage: "register",
    ForgotPage: "forgot",
}

export const Requests = {
    CreateAccount: "createAccount",
    ValidateUsername: "validateUsername",
    SignIn: "signIn",
    ForgotPassword: "forgotPassword",
    ResetPassword: "resetPassword",
    Form: "form",
    ValidSession: "validSession",
    ModifyForm: "modifyForm"
}

export const NoAccount: AccountData = {
    id: -1,
    name: "",
    accessToken: "",
}

export const NoWorkout: TrackedWorkout = {
    date: new Date(0, 0, 0),
    lifts: [],
    type: "",
    workout_length_minutes: 0,
}

export const Muscles= ['abdominals', 'hamstrings', 'calves', 'shoulders', 'adductors', 'glutes', 'quadriceps', 'biceps', 'forearms', 'abductors', 'triceps', 'chest', 'lower back', 'traps', 'middle back', 'lats', 'neck']
export const Equipment = ['body only', 'machine', 'other', 'foam roll', 'kettlebells', 'dumbbell', 'cable', 'barbell', 'bands', 'medicine ball', 'exercise ball', 'e-z curl bar']
// export const Mechanic = ['compound', 'isolation']
// export const Level = ['beginner', 'intermediate', 'expert']
// export const Category = ['strength', 'stretching', 'plyometrics', 'strongman', 'powerlifting', 'cardio', 'olympic weightlifting']

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