import React, {Dispatch, memo, SetStateAction, useEffect, useMemo, useState} from "react";
import {capitalize, getExerciseImage} from "../../utils/Util.tsx";
import {NavigateFunction, Outlet, useLocation, useNavigate} from "react-router-dom";
import {MuscleGroups, Muscles, NoAccount, NoWorkout, Pages} from "../../utils/Constants.ts";
import {AccountData} from "../accounts/AccountManager.tsx";
import {List, RowComponentProps} from 'react-window';
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
    const location = useLocation();

    const selectedExercise = location.state?.exercise ?? null;

    const fuse = new Fuse(exerciseNames, {
        threshold: 0.15,
        shouldSort: true,
    });

    const results = fuse.search(exercise).map(r => r.item);

    useEffect(() => {
        if (selectedExercise != null) {
            setAdding(true)
            setExercise(selectedExercise)
        }
    }, [selectedExercise]);

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
    const [muscleCategory, setMuscleCategory] = useState("");
    const [equipment, setEquipment] = useState("");
    const [muscleCategories, setMuscleCategories] = useState<string[]>([]);
    const [results, setResults] = useState<ExerciseDB[]>(exerciseDB as ExerciseDB[]);
    const [filters, setFilters] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [showImages, setShowImages] = useState(false);

    const db = exerciseDB as ExerciseDB[];
    const fuse = useMemo(() => createFuse(db), [db]);
    const navigate = useNavigate();

    useEffect(() => {
        let filtered = query.trim() ? fuse.search(query).map(r => r.item) : db;
        if (filters.length && muscleCategory !== "") filtered = filtered.filter(ex => {
            if (!filters.length) return true;
            return filters.some(f => {
                if (muscleCategory === "Muscles") return ex.primaryMuscles?.includes(f) || ex.secondaryMuscles?.includes(f);
                else if (muscleCategory === "Muscle Groups") return MuscleGroups[f as keyof typeof MuscleGroups].some(s => ex.primaryMuscles?.includes(s) || ex.secondaryMuscles?.includes(s))
                return true;
            })
        });
        if (equipment.length) filtered = filtered.filter(ex => ex.equipment?.includes(equipment));
        setResults(filtered);
    }, [query, filters, fuse, db, muscleCategory, equipment]);

    useEffect(() => {
        if (muscleCategory === "Muscle Groups") setMuscleCategories(Object.keys(MuscleGroups))
        else if (muscleCategory === "Muscles") setMuscleCategories(Muscles)
        else setMuscleCategories([])
    }, [muscleCategory]);

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo} />
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Search</h1>
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

                    <div className={styles.controls}>
                        <div className={styles.categoryRow}>
                            <span className={styles.categoryLabel}>Search Category</span>

                            <select
                                className={styles.categorySelect}
                                value={muscleCategory}
                                onChange={e => setMuscleCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Muscle Groups">Muscle Groups</option>
                                <option value="Muscles">Muscles</option>
                            </select>

                            <span className={styles.categoryLabel}>Select Equipment</span>

                            <select
                                className={styles.categorySelect}
                                value={equipment}
                                onChange={e => setEquipment(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="body only">Body Weight</option>
                                <option value="machine">Machine</option>
                                <option value="foam roll">Foam Roll</option>
                                <option value="kettlebells">Kettlebells</option>
                                <option value="dumbbell">Dumbbell</option>
                                <option value="cable">Cable</option>
                                <option value="barbell">Barbell</option>
                                <option value="bands">Bands</option>
                                <option value="medicine ball">Medicine Ball</option>
                                <option value="exercise ball">Exercise Ball</option>
                                <option value="e-z curl bar">EZ Curl Bar</option>
                            </select>
                        </div>

                        <label className={styles.toggle}>
                            <span>Show Images</span>
                            <input
                                type="checkbox"
                                checked={showImages}
                                onChange={e => setShowImages(e.target.checked)}
                            />
                            <span className={styles.slider} />
                        </label>
                    </div>

                    <div className={styles.stickySearch}>
                        <input
                            className={styles.selectorInput}
                            placeholder="Search..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />

                        <div className={styles.pills}>
                                {muscleCategories.map(tag => (
                                <button
                                    key={tag}
                                    className={`${styles.pill} ${filters.includes(tag) ? styles.active : ""}`}
                                    onClick={() => setFilters(f => f.includes(tag) ? f.filter(t => t !== tag) : [...f, tag])}
                                >
                                    {capitalize(tag)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {results.length > 0 && (
                        <div className={styles.resultsMeta}>
                            Showing{" "}
                            <strong>{results.length} </strong>
                            of <strong>{db.length}</strong>
                        </div>
                    )}

                    <div className={styles.results}>
                        <List
                            rowCount={results.length}
                            rowHeight={420}
                            rowComponent={ExerciseCard}
                            rowProps={{ navigate, results, showImages, selected, setSelected }}
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

const ExerciseCard = memo(function ExerciseCard({ navigate, index, results, showImages, selected, setSelected }: RowComponentProps<{ navigate: NavigateFunction, results: ExerciseDB[], showImages: boolean, selected: string | null, setSelected: Dispatch<SetStateAction<string | null>> }>) {
    const exercise = results[index];
    const images = getExerciseImage(exercise.images);
    const [expanded, setExpanded] = useState(false);
    const previewSteps = exercise.instructions.slice(0, 3);
    const hiddenSteps = exercise.instructions.length - previewSteps.length;
    const isSelected = selected === exercise.name;

    const toggleSelect = () => {
        setSelected(prev =>
            prev === exercise.name ? null : exercise.name
        );
    };

    const handleConfirm = () => {
        navigate(`${Pages.TrackerPage}/${Pages.TrackPage}`, { state: { exercise: exercise.name } });
    }

    return (
        <div
            className={`${styles.exerciseCard} ${isSelected ? styles.selected : ""}`}
            onClick={toggleSelect}
        >
            {isSelected && (
                <button
                    className={styles.checkmark}
                    onClick={e => {
                        e.stopPropagation();
                        handleConfirm();
                    }}
                    aria-label="Selected"
                >
                    ✓
                </button>
            )}

            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{exercise.name}</h3>
            </div>

            <div className={styles.imageWrapper}>
                {showImages && (
                    <img
                        src={images.start}
                        loading="lazy"
                        decoding="async"
                        alt={exercise.name}
                        className={styles.exerciseImage}
                    />
                )}
            </div>

            <div className={styles.metaRow}>
                <span><strong>Level:</strong> {capitalize(exercise.level)}</span>
                <span><strong>Equipment:</strong> {capitalize(exercise.equipment)}</span>
            </div>

            <ul className={`${styles.instructions} ${expanded ? styles.expanded : ""}`}>
                {(expanded ? exercise.instructions : previewSteps).map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ul>

            {exercise.instructions.length > 3 && (
                <button
                    className={styles.expandButton}
                    onClick={e => {
                        e.stopPropagation();
                        setExpanded(v => !v);
                    }}
                >
                    {expanded ? "Show less" : `Show ${hiddenSteps} step${hiddenSteps > 1 ? "s" : ""}`}
                </button>
            )}
        </div>
    );
});