import Dexie, { Table } from "dexie"
import {Workouts} from "../pages/tracker/Tracker.tsx";

export type WorkoutsRecord = {
    id: string
    data: Workouts
}

class WorkoutDB extends Dexie {
    workouts!: Table<WorkoutsRecord, string>

    constructor() {
        super("WorkoutDB")
        this.version(1).stores({
            workouts: "id"
        })
    }
}

export const DB = new WorkoutDB()