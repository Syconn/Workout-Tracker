import {useEffect, useMemo, useState} from "react";
import {ExerciseDB, MuscleGroups, Muscles} from "../utils/data.ts";
import {useNavigate} from "react-router-dom";
import {Home} from "lucide-react";
import Fuse from "fuse.js";
import homeStyles from "../styles/Home.module.css";
import styles from "../styles/Tracker.module.css";
import {capitalize, useDebounce} from "../utils/util.ts";
import ExerciseCard from "./ExerciseCard.tsx";
import {List} from "react-window";

function ExerciseSearch({ workouts, fuse} : { workouts: ExerciseDB[]; fuse: Fuse<ExerciseDB> }) {
    const [query, setQuery] = useState("");
    const [muscleCategory, setMuscleCategory] = useState("");
    const [equipment, setEquipment] = useState("");
    const [muscleCategories, setMuscleCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [showImages, setShowImages] = useState(false);

    const navigate = useNavigate();
    const debouncedQuery = useDebounce(query, 150);

    const results = useMemo(() => {
        let filtered = debouncedQuery.trim() ? fuse.search(debouncedQuery).map(r => r.item) : workouts;

        if (filters.length && muscleCategory !== "") {
            filtered = filtered.filter(ex => {
                return filters.some(f => {
                    if (muscleCategory === "Muscles") return ex.primaryMuscles?.includes(f) || ex.secondaryMuscles?.includes(f);
                    if (muscleCategory === "Muscle Groups") return MuscleGroups[f as keyof typeof MuscleGroups].some(s => ex.primaryMuscles?.includes(s) || ex.secondaryMuscles?.includes(s));
                    return true;
                });
            });
        }

        if (equipment.length) filtered = filtered.filter(ex => ex.equipment?.includes(equipment));

        return filtered;
    }, [debouncedQuery, filters, fuse, workouts, muscleCategory, equipment]);

    useEffect(() => {
        if (muscleCategory === "Muscle Groups") setMuscleCategories(Object.keys(MuscleGroups))
        else if (muscleCategory === "Muscles") setMuscleCategories(Muscles)
        else setMuscleCategories([])
    }, [muscleCategory]);

    const rowProps = useMemo(() => ({results, showImages, selected, setSelected}), [results, showImages, selected]);

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="/icon.png" alt="Workout Tracker Logo" className={homeStyles.logo}/>
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Search</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2}/>
                    </button>
                </div>
            </header>

            <main className={styles.profileContainer}>
                <div className={styles.selectorCard}>
                    <h1 className={styles.heading}>Workout Tracker</h1>

                    <div className={styles.controls}>
                        <div className={styles.categoryRow}>
                            <span className={styles.categoryLabel}>Search Category</span>

                            <select className={styles.categorySelect} value={muscleCategory} onChange={e => setMuscleCategory(e.target.value)}>
                                <option value="">All</option>
                                <option value="Muscle Groups">Muscle Groups</option>
                                <option value="Muscles">Muscles</option>
                            </select>

                            <span className={styles.categoryLabel}>Select Equipment</span>

                            <select className={styles.categorySelect} value={equipment} onChange={e => setEquipment(e.target.value)}>
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
                            <input type="checkbox" checked={showImages} onChange={e => setShowImages(e.target.checked)} />
                            <span className={styles.slider}/>
                        </label>
                    </div>

                    <div className={styles.stickySearch}>
                        <input className={styles.selectorInput} placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}/>

                        <div className={styles.pills}>
                            {muscleCategories.map(tag =>
                                <button key={tag} className={`${styles.pill} ${filters.includes(tag) ? styles.active : ""}`} onClick={() => setFilters(f => f.includes(tag) ? f.filter(t => t !== tag) : [...f, tag])}>
                                    {capitalize(tag)}
                                </button>
                            )}
                        </div>
                    </div>

                    {results.length > 0 &&
                        <div className={styles.resultsMeta}>
                            Showing{" "}<strong>{results.length} </strong> of <strong>{workouts.length}</strong>
                        </div>
                    }

                    <div className={styles.results}>
                        <List rowCount={results.length} rowHeight={1} rowComponent={ExerciseCard} rowProps={rowProps}/>
                        {results.length === 0 && <p className={styles.noResults}>No exercises found</p>}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ExerciseSearch