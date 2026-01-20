import Dexie, { Table } from "dexie"
import { Workouts } from "./types"

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


// replaces loading
// const [workouts, setWorkoutProp] = useTypeState<Workouts>(NoSavedWorkouts)
//
// useEffect(() => {
//     let cancelled = false
//
//     async function loadWorkouts() {
//         const record = await workoutDB.workouts.get("main")
//         if (!record || cancelled) return
//
//         setWorkoutProp(record.data)
//     }
//
//     loadWorkouts()
//
//     return () => {
//         cancelled = true
//     }
// }, [])

//replaces saving
// useEffect(() => {
//     if (workouts === NoSavedWorkouts) return
//
//     workoutDB.workouts.put({
//         id: "main",
//         data: workouts
//     })
// }, [workouts])