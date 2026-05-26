import {getDB} from "./database.js";
import * as fs from "node:fs";
import path = require("node:path");

export async function seedWorkoutsIfEmpty() {
    const db = getDB();
    const row = await db.get("SELECT COUNT(*) as count FROM workouts");

    if (row.count === 0) {
        console.log("Importing workouts...");
        const workoutsPath = path.join(process.cwd(), "src/database/exercises.json");
        const workouts = JSON.parse(fs.readFileSync(workoutsPath, "utf8"));

        for (const workout of workouts) {
            await db.run(`
                INSERT OR IGNORE INTO workouts (
                    id,
                    name,
                    force_type,
                    level,
                    mechanic,
                    equipment,
                    category,
                    primary_muscles,
                    secondary_muscles,
                    instructions,
                    images
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                    workout.id,
                    workout.name,
                    workout.force,
                    workout.level,
                    workout.mechanic,
                    workout.equipment,
                    workout.category,
                    JSON.stringify(workout.primaryMuscles),
                    JSON.stringify(workout.secondaryMuscles),
                    JSON.stringify(workout.instructions),
                    JSON.stringify(workout.images)
                ]
            );
        }

        console.log("Workout import complete.");
    } else {
        console.log("Workout table already populated.");
    }

}