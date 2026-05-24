import {capitalize, getExerciseImage} from "../utils/util.ts";
import {useNavigate} from "react-router-dom";
import {ExerciseDB, Pages} from "../utils/data.ts";
import {RowComponentProps} from 'react-window';
import {useState} from "react";
import styles from "../styles/Tracker.module.css";

function ExerciseCard({index, results, showImages, selected, setSelected}: RowComponentProps<{ results: ExerciseDB[], showImages: boolean, selected: string | null, setSelected: (val: string | null) => void }>) {
    const [expanded, setExpanded] = useState(false);

    const exercise = results[index];
    const images = getExerciseImage(exercise.images);
    const previewSteps = exercise.instructions.slice(0, 3);
    const hiddenSteps = exercise.instructions.length - previewSteps.length;
    const isSelected = selected === exercise.name;
    const navigate = useNavigate();
    const toggleSelect = () => setSelected(selected === exercise.name ? null : exercise.name);
    const handleConfirm = () => navigate(`${Pages.TrackerPage}/${Pages.TrackPage}`, {state: {exercise: exercise.name}});

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
                {showImages && <img src={images.start} loading="lazy" decoding="async" width={750} height={500} alt={exercise.name} className={styles.exerciseImage}/>}
            </div>

            <div className={styles.metaRow}>
                <span><strong>Level:</strong> {capitalize(exercise.level)}</span>
                <span><strong>Equipment:</strong> {exercise.equipment !== null ? capitalize(exercise.equipment) : "None"}</span>
            </div>

            <ul className={`${styles.instructions} ${expanded ? styles.expanded : ""}`}>
                {(expanded ? exercise.instructions : previewSteps).map((step, i) => <li key={i}>{step}</li>)}
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
}

export default ExerciseCard;