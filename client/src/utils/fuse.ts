import Fuse from "fuse.js";
import {ExerciseDB} from "./data.ts";

export function createFuse(exercises: ExerciseDB[]) {
    return new Fuse(exercises, { keys: ["name", "id",], threshold: 0.25, ignoreLocation: true });
}