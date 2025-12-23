import homeStyles from "../home/Home.module.css";
import {Home} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import exercisesData from "../../data/exercises.json";
import {createFuse} from "../../utils/fuse.ts";
import {getExerciseImage} from "../../utils/Util.tsx";

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

export function ExerciseCard({ exercise }: { exercise: ExerciseDB }) {
    const images = getExerciseImage(exercise.images);

    return (
        <div className="exercise-card">
            <h3>{exercise.name}</h3>

            <div className="images">
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


function Tracker() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggleMuscle = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            // next.has(id) ? next.delete(id) : next.add(id);
            const toggleMuscle = (id: string) => {
                setSelected(prev => {
                    const next = new Set(prev);

                    if (next.has(id)) {
                        next.delete(id);
                    } else {
                        next.add(id);
                    }

                    return next;
                });
            };

            toggleMuscle(id);
            return next;
        });
    };

    const getFill = (id: string) => {
        if (selected.has(id)) return "#ff6b6b"; // clicked
        if (hovered === id) return "#ffd93d";   // hover
        return "#e0e0e0";                       // default
    };

    return (
        <BodyMap />
        // <svg viewBox="0 0 500 1000">
        //     <path
        //         id="chest"
        //         d="M..."
        //         fill={getFill("chest")}
        //         onMouseEnter={() => setHovered("chest")}
        //         onMouseLeave={() => setHovered(null)}
        //         onClick={() => toggleMuscle("chest")}
        //     />
        //
        //     <path
        //         id="abs"
        //         d="M..."
        //         fill={getFill("abs")}
        //         onMouseEnter={() => setHovered("abs")}
        //         onMouseLeave={() => setHovered(null)}
        //         onClick={() => toggleMuscle("abs")}
        //     />
        // </svg>
    );

    // const [query, setQuery] = useState("");
    // const [exercises, setExercises] = useState<ExerciseDB[]>([]);
    // const [results, setResults] = useState<ExerciseDB[]>([]);
    // const navigate = useNavigate();
    //
    // useEffect(() => {
    //     setExercises(exercisesData as ExerciseDB[]);
    //     setResults(exercisesData as ExerciseDB[]);
    // }, []);
    //
    // const fuse = useMemo(() => createFuse(exercises), [exercises]);
    //
    // useEffect(() => {
    //     if (!query.trim()) setResults(exercises);
    //     else setResults(fuse.search(query).map(r => r.item));
    // }, [query, fuse, exercises]);
    //
    // return (
    //     <div className={homeStyles.page}>
    //         <header className={homeStyles.appHeader}>
    //             <div className={homeStyles.headerLeft}>
    //                 <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo} />
    //             </div>
    //
    //             <div className={homeStyles.headerCenter}>
    //                 <h1 className={homeStyles.title}>Profile</h1>
    //             </div>
    //
    //             <div className={homeStyles.headerRight}>
    //                 <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
    //                     <Home size={20} color="#f5f5f5" strokeWidth={2} />
    //                 </button>
    //             </div>
    //         </header>
    //
    //         <div className="tracker">
    //             <h1>Workout Tracker</h1>
    //
    //             <input
    //                 className="search"
    //                 placeholder="Search exercises, muscles, equipment..."
    //                 value={query}
    //                 onChange={e => setQuery(e.target.value)}
    //             />
    //
    //             <div className="exercise-grid">
    //                 {results.map(ex => (
    //                     <ExerciseCard key={ex.name} exercise={ex} />
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // )
}

export default Tracker