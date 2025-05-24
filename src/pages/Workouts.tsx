import { useEffect, useState } from "react";
import { capitalize, useArrayState, useTypeState } from "../utils/Util";
import { EditableDropDown, WorkoutsList } from "../utils/Components";

export type Reps = {
    weight: number;
    reps: number;
    superset: Reps | null;
}

export type Workout = {
    name: string;
    reps: Reps[];
}

export type LiftSession = {
    date: string;
    program: string;
    workouts: Workout[];
}

export type WorkoutData = {
    lifts: LiftSession[];
    lastWorkoutOfType: Workout[];
}

type WorkoutDataProp = {
    workoutData: WorkoutData;
    modifyWorkoutData: <K extends keyof WorkoutData>(key: K, value: WorkoutData[K]) => void;
}

export function WorkoutTrackerMenu({ workoutData, modifyWorkoutData }: WorkoutDataProp) {
    const [liftSession, setLiftSession] = useTypeState<LiftSession>(() => {
        const stored = localStorage.getItem("liftSession");
        return stored ? JSON.parse(stored) : {date: "", program: "", workouts: []};
    });
    const [active, setActive] = useState(true); // liftSession.workouts.length != 0

    useEffect(() => {
        localStorage.setItem("liftSession", JSON.stringify(liftSession));
    }, [liftSession]);

    const setup = (date: string, program: string) => {
        setActive(true);
    }

    return (
        <>
        {!active && <SetupWorkoutTracker setup={setup}/>}
        {active && <WorkoutTracker workoutData={workoutData} modifyWorkoutData={modifyWorkoutData}/>}
        </>
    );
}

function SetupWorkoutTracker({ setup } : { setup: (date: string, program: string) => void }) {
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [program, setProgram] = useState("");

    return (
        <>
        Setup Workout
        <div></div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}></input>
        <input type="text" placeholder={"Program"} value={program} onChange={e => setProgram(e.target.value)}></input>
        <button onClick={() => setup(date, program)}>Start Workout</button>
        </>
    );
}

function WorkoutTracker({ workoutData, modifyWorkoutData }: WorkoutDataProp) {
    const testWorkout: Workout[] = [{"name": "Bench Press", "reps": [{"reps": 6, "weight": 125, "superset": null}]}, {"name": "bicep Curl", "reps": [{"reps": 6, "weight": 25, "superset": null}]}]
    const [active, setActive] = useState(false);
    const [count, setCount] = useState(1);
    const [workout, setWorkout] = useTypeState<Workout>({name: "", reps: []});
    const [workouts, addWorkouts, removeWorkouts] = useArrayState<Workout>(() => { // MAKE SURE TO CLEAR WORKOUT WHEN ADDING TO MEM
        const stored = localStorage.getItem("workouts");
        return stored ? JSON.parse(stored) as Workout[] : [];
    });

    useEffect(() => localStorage.setItem("workouts", JSON.stringify(workouts)), [workouts]);     

    return (
        <>
        {!active && (
            <>
            <EditableDropDown workouts={workoutData.lastWorkoutOfType.map(v => capitalize(v.name))} value={workout?.name} setChange={v => setWorkout("name", v)}/>
            <input type="button" value={"Set Workout"} onClick={() => workout.name.length && setActive(true)}/>
            </>
        )}
        {active && (
            <>
            <label>{workout.name}</label>
            {Array.from({length: count}).map(v => (
                <>
                </>
            ))}
            </>
        )}
        <div/>
        <WorkoutsList workouts={testWorkout} title={"Session Exercises:"}/>
        </>
    );
}