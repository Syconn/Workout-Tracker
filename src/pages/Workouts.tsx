import { useEffect, useState } from "react";
import { useArrayState, useSetProp } from "../utils/Util";
import { EditableDropDown } from "../utils/Components";

type Reps = {
    weight: number;
    reps: number;
    superset: Reps;
}

type Workout = {
    name: string;
    reps: Reps[];
}

type LiftSession = {
    date: string;
    program: string;
    workouts: Workout[];
}

export type WorkoutData = {
    lifts: LiftSession[];
    lastWorkoutOfType: Workout[]; // Tracks the last Workout of each
}

type WorkoutDataProp = {
    workoutData: WorkoutData;
    modifyWorkoutData: <K extends keyof WorkoutData>(key: K, value: WorkoutData[K]) => void;
}

export function WorkoutTrackerMenu({ workoutData, modifyWorkoutData }: WorkoutDataProp) {
    const [liftSession, setLiftSession] = useState<LiftSession>(() => {
        const stored = localStorage.getItem("liftSession");
        return stored ? JSON.parse(stored) : { date: "", program: "", workouts: [] };
    });
    const setLift = useSetProp(setLiftSession);
    const [active, setActive] = useState(liftSession.workouts.length != 0);
    
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
    const [program, setProgram] = useState("")

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
    const [workouts, addWorkout, removeWorkout] = useArrayState<Workout>(() => { // MAKE SURE TO CLEAR WORKOUT WHEN ADDING TO MEM
        const stored = localStorage.getItem("workouts");
        return stored ? JSON.parse(stored) as Workout[] : [];
    });

    useEffect(() => {
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }, [workouts]);        

    return (
        <>
        <EditableDropDown workouts={workoutData.lastWorkoutOfType.map(v => v.name)}/>
        <div></div>
        Session Exercises:
        </>
    );
}