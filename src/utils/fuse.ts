import Fuse from "fuse.js";
import {ExerciseDB} from "../pages/tracker/Tracker.tsx";
export function createFuse(exercises: ExerciseDB[]) {
    return new Fuse(exercises, {
        keys: [
            "name",
            "primaryMuscles",
            "secondaryMuscles",
            "equipment",
            "level",
            "category"
        ],
        threshold: 0.35, 
        ignoreLocation: true,
        minMatchCharLength: 2
    });
}