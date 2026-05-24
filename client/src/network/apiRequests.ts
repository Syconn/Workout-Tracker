import {URL} from "../utils/data.ts";

export async function loadWorkouts() {
    const res = await fetch(URL + "/api/workouts", { credentials: "include" });

    const body = await res.json();
    if (!res.ok) return null;
    return body;
}