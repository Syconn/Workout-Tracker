import { useEffect, useState } from "react";
import { useSetProp } from "../utils/Util";

export type Reps = {
    weight: number;
    reps: number;
    superset: Reps;
}

export type Workout = {
    name: string;
    reps: Reps[]
}

export type LiftSession = {
    date: string;
    program: string;
    workouts: Workout[]
}

export function WorkoutTrackerMenu() {
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
        {active && <WorkoutTracker />}
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

function WorkoutTracker() {
    return (
        <>
        <div></div>
        Tracked Workout:
        
        </>
    );
}