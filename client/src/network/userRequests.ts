import {TrackedWorkout, URL, WorkoutSet} from "../utils/data.ts"

export async function userInfo() {
    const res = await fetch(URL + "/user/info", {
        credentials: "include"
    });

    const body = await res.json();
    if (!res.ok) return null;
    return body.info;
}

export async function updateInfo(name: string, email: string) {
    const res = await fetch(URL + "/user/updateInfo", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email }),
    })

    if (!res.ok) console.log("update Failed");
    return res.ok;
}

export async function saveWorkoutClient(workout: TrackedWorkout) {
    const res = await fetch(URL + "/user/save", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ workout }),
    })

    const body = await res.json();
    if (!res.ok) console.log(body.error);
    return body.success;
}

export async function loadLastLift(exerciseId: string) {
    const res = await fetch(URL + "/user/lastLift", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ exerciseId }),
    })

    const text = await res.text();
    if (!text) return undefined;
    return JSON.parse(text) as WorkoutSet[];
}

export async function loadPr(exerciseId: string) {
    const res = await fetch(URL + "/user/pr", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ exerciseId }),
    })

    const body = await res.json();
    if (!res.ok) {
        console.log(body.error);
        return undefined
    }

    const text = await res.text();
    if (!text) return undefined;
    return JSON.parse(text) as WorkoutSet;
}