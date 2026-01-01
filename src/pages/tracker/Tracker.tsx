import {useEffect, useMemo, useState} from "react";
import {getExerciseImage} from "../../utils/Util.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {NoAccount, NoWorkout, Pages} from "../../utils/Constants.ts";
import {AccountData} from "../accounts/AccountManager.tsx";
import {List, RowComponentProps, useDynamicRowHeight} from 'react-window';
import homeStyles from "../home/Home.module.css";
import styles from "./Tracker.module.css";
import exerciseDB from "../../data/exercises.json"
import exerciseNames from "../../data/exercise_names.json"
import {Home} from "lucide-react";
import {createFuse} from "../../utils/fuse.ts";
import Fuse from "fuse.js";

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
    date: Date;
    workout_length_minutes: number;
    sets: Set[]
}

export type Set = {
    exercise_id: string;
    reps: Rep[]
}

export type Rep = {
    weight: number;
    reps: number;
    superset: Rep[]
}

export type SetWorkoutProp = {
    setWorkout: <K extends keyof TrackedWorkout>(key: K, value: TrackedWorkout[K]) => void
}

export function TrackerStart({ workout, setWorkout }: { workout: TrackedWorkout } & SetWorkoutProp) {
    const [type, setType] = useState("")
    const navigate = useNavigate();

    const track = () => {
        setWorkout("type", type)
        navigate(Pages.TrackPage)
    }

    useEffect(() => {
        if (workout !== NoWorkout) navigate(`${Pages.TrackerPage}/${Pages.TrackPage}`)
    }, [navigate, workout]);

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo} />
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Tracker</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2} />
                    </button>
                </div>
            </header>

            <main className={styles.profileContainer}>
                <div className={styles.selectorCard}>
                    <span className={styles.selectorLabel}>Workout Type</span>

                    <select className={styles.selectorInput} onChange={val => setType(val.target.value)}>
                        <option value="">Select a workout</option>
                        <option value="push">Push</option>
                        <option value="pull">Pull</option>
                        <option value="legs">Legs</option>
                        <option value="upper">Upper</option>
                        <option value="lower">Lower</option>
                    </select>

                    <button className={styles.trackButton} disabled={type === ""} onClick={track}>Track Workout</button>
                </div>
            </main>
        </div>
    )
}

export function Track({ workout, setWorkout } : { workout: TrackedWorkout } & SetWorkoutProp) { // Cancel Button
    const [adding, setAdding] = useState(false)
    const [exercise, setExercise] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const fuse = new Fuse(exerciseNames, {
        threshold: 0.15,
        shouldSort: true,
    });

    const results = fuse.search(exercise).map(r => r.item);

    useEffect(() => {
        if (workout === NoWorkout) navigate(`${Pages.TrackerPage}/${Pages.StartPage}`)
    }, [navigate, workout]);

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo} />
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Tracker</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2} />
                    </button>
                </div>
            </header>

            <main className={styles.profileContainer}>
                <div className={styles.selectorCard}>
                    <button className={styles.trackButton} onClick={() => setAdding(!adding)} hidden={adding}>Add a Lift</button>
                    {adding && (
                        <div className={styles.innerCard}>
                            <div className={styles.searchRow}>
                                <button className={styles.iconButton} onClick={() => navigate(`${Pages.TrackerPage}/${Pages.SearchPage}`)} data-tooltip="Find Exercise">🔎</button>

                                <div className={styles.autocomplete}>
                                    <input
                                        className={styles.selectorInput}
                                        placeholder="Enter Exercise"
                                        value={exercise}
                                        onChange={e => {
                                            setExercise(e.target.value);
                                            setOpen(true);
                                        }}
                                        onBlur={() => setTimeout(() => setOpen(false), 100)}
                                        onClick={() => setOpen(true)}
                                    />

                                    {open && exercise && (
                                        <ul className={styles.suggestions}>
                                            {results.map((item, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => {
                                                        setExercise(item);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <button className={styles.confirmButton}  data-tooltip="Track Exercise">✅</button>
                            </div>

                            <button className={styles.removeButton} onClick={() => setAdding(!adding)} hidden={!adding}>Remove Lift</button>
                        </div>
                    )}
                    <h2 className={styles.heading}>Current Workout</h2>
                </div>
            </main>
        </div>
    )
}

export function Tracker({ account }: { account: AccountData }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (account === NoAccount) navigate(`${Pages.AccountManager}`)
    }, [navigate, account]);

    return (
        <Outlet />
    )
}

export function ExerciseSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ExerciseDB[]>(exerciseDB as ExerciseDB[]);
    const [filters, setFilters] = useState<string[]>([]);

    const changeMe = ["Chest", "Back", "Legs", "Dumbbell", "Barbell"];
    const db = exerciseDB as ExerciseDB[];
    const fuse = useMemo(() => createFuse(db), [db]);
    const navigate = useNavigate();

    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: 500
    });


    useEffect(() => {
        let filtered = query.trim() ? fuse.search(query).map(r => r.item) : db;
        if (filters.length) filtered = filtered.filter(ex => filters.some(f => ex.primaryMuscles?.includes(f) || ex.equipment?.includes(f)));
        setResults(filtered);
    }, [query, filters, fuse, db]);

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo} />
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Profile</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2} />
                    </button>
                </div>
            </header>

            <main className={styles.profileContainer}>
                <div className={styles.selectorCard}>
                    <h1>Workout Tracker</h1>

                    <div className={styles.stickySearch}>
                        <input
                            className={styles.selectorInput}
                            placeholder="Search exercises, muscles, equipment..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />

                        <div className={styles.pills}>
                            {changeMe.map(tag => (
                                <button
                                    key={tag}
                                    className={`${styles.pill} ${filters.includes(tag) ? styles.active : ""}`}
                                    onClick={() => setFilters(f => f.includes(tag) ? f.filter(t => t !== tag) : [...f, tag])}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.results}>
                        <List
                            rowCount={results.length}
                            rowHeight={rowHeight}
                            rowComponent={ExerciseCard}
                            rowProps={{ results }}
                        />
                        {results.length === 0 && (
                            <p className={styles.noResults}>No exercises found</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

function ExerciseCard({ index, results }: RowComponentProps<{ results: ExerciseDB[] }>) {
    const exercise = results[index];
    const images = getExerciseImage(exercise.images);

    return (
        <div className={styles.exerciseCard}>
            <h3>{exercise.name}</h3>

            <div>
                <img src={images.start} loading="lazy" decoding="async" alt="start" width="400" height="300" />
                {/*<img src={images.end} loading="lazy" alt="end" />*/}
            </div>

            <p><strong>Level:</strong> {exercise.level}</p>
            <p><strong>Equipment:</strong> {exercise.equipment}</p>

            <ul>
                {exercise.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ul>
        </div>
    );
}