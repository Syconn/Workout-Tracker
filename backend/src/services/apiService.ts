import {getDB} from "../database/database.js";

export async function getAllWorkouts() { ///api/images/3_4_Sit-Up/0.jpg
    const db = getDB();
    const workouts = await db.all("SELECT * FROM workouts");

    return workouts.map(workout => ({
        ...workout,
        primaryMuscles: JSON.parse(workout.primary_muscles || "[]"),
        secondaryMuscles: JSON.parse(workout.secondary_muscles || "[]"),
        instructions: JSON.parse(workout.instructions || "[]"),
        images: JSON.parse(workout.images || "[]").map((img: string) => `/images/${img}`)
    }));
}