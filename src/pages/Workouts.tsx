import { useEffect, useState } from "react";
import { capitalize, useAddArrayState, useDynamicState, useTypeState } from "../utils/Util";
import { AutoWidthInput, combinePriority, EditableDropDown, WorkoutsList } from "../utils/Components";
import React from "react";
import { AuthContext } from "./Signin";

export type Reps = {
    weight: number;
    reps: number;
}

export type Workout = {
    name: string;
    note: string;
    reps: Reps[];
}

export type LiftSession = {
    date: string;
    program: string;
    time: number;
    workouts: Workout[];
}

export type WorkoutData = {
    lifts: LiftSession[];
    lastWorkoutOfType: Workout[];
}

type WorkoutDataProp = {
    setPage: (p: string) => void;
    workoutData: WorkoutData;
    modifyWorkoutData: <K extends keyof AuthContext>(key: K, value: AuthContext[K]) => void;
}

type WorkoutDataProp2 = {
    workoutData: WorkoutData;
    modifyWorkoutData: (w: Workout[]) => void;
}

export function WorkoutTrackerMenu({ setPage, workoutData, modifyWorkoutData }: WorkoutDataProp) {
    const [liftSession, setLiftSession] = useTypeState<LiftSession>(() => {
        const stored = localStorage.getItem("liftSession");
        return stored ? JSON.parse(stored) : {date: "", program: "", time: 0, workouts: []};
    });
    const [active, setActive] = useState(liftSession.date != "");

    useEffect(() => {
        localStorage.setItem("liftSession", JSON.stringify(liftSession));
    }, [liftSession]);

    const start = (date: string, program: string) => {
        setLiftSession("date", date);
        setLiftSession("program", program);
        setLiftSession("time", Date.now());
        setActive(true);
    }

    const workout = (workout: Workout[]) => {
        setActive(false);
        if (workout.length >= 1)
            modifyWorkoutData("data", {"lifts": [...workoutData.lifts, {"date": liftSession.date, "program": liftSession.program, "time": (Date.now() - liftSession.time) / 1000 / 60, 
                "workouts": workout}], "lastWorkoutOfType": combinePriority(workout, workoutData.lastWorkoutOfType)});
        localStorage.removeItem("liftSession");
        setPage("home");
    }

    return (
        <>
        {!active && <SetupWorkoutTracker setup={start}/>}
        {active && <WorkoutTracker workoutData={workoutData} modifyWorkoutData={workout}/>}
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

function WorkoutTracker({ workoutData, modifyWorkoutData }: WorkoutDataProp2) {
    const [active, setActive] = useState(false);
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [liftData, changeLiftData, changeAll, addInput, removeInput] = useDynamicState(["", ""]);
    const [workouts, addWorkouts, removeWorkout] = useAddArrayState<Workout>(() => {
        const stored = localStorage.getItem("workouts");
        return stored ? JSON.parse(stored) as Workout[] : [];
    });

    useEffect(() => localStorage.setItem("workouts", JSON.stringify(workouts)), [workouts]);
    
    const finalize = (clear: boolean) => {
        if (!clear) {
            const reps: Reps[] = [];
            for (let i = 0; i < liftData.length / 2; i++) {
                if (liftData[i * 2].length > 0 && liftData[i * 2 + 1].length > 0) reps[i] = {"weight": parseInt(liftData[i * 2]), "reps": parseInt(liftData[i * 2 + 1])}
            }
            addWorkouts({"name": name, "reps": reps, "note": note});
        }
        changeAll(["", ""]);
        setName("");
        setNote("");
        setActive(false);
    }

    const finish = () => {
        localStorage.removeItem("workouts");
        modifyWorkoutData(workouts);
    }

    return (
        <>
        {!active && (
            <>
            <EditableDropDown workouts={combinePriority(workouts, workoutData.lastWorkoutOfType).map(v => capitalize(v.name))} value={capitalize(name)} setChange={v => setName(capitalize(v))}/>
            <input type="button" value={"Set Workout"} onClick={() => {
                if (name.length) {
                    const same = workouts.filter(v => v.name === name);
                    const old = workoutData.lastWorkoutOfType.find(v => v.name === name);
                    setActive(true);
                    if (same.length > 0) {
                        changeAll(same[0].reps.flatMap(({weight, reps}) => [weight.toString(), reps.toString()]));
                        console.log(same[0].note);
                        removeWorkout(same[0]);
                    }
                    if (old != null) setNote(old.note);
                }
            }}/>
            </>
        )}
        {active && (    
            <>
            <label>{name}</label>
            <AutoWidthInput note={"Note: "} value={note} setValue={setNote}/>
            {liftData.slice(0, liftData.length / 2).map((_v, i) => (
                <React.Fragment key={i}>
                    <br/>
                    <label>Weight: </label>
                    <input type="number" min={0} value={liftData[i * 2]} onChange={v => changeLiftData(i * 2, v.target.value)}/>
                    <label> Reps: </label>
                    <input type="number" min={0} value={liftData[i * 2 + 1]} onChange={v => changeLiftData(i * 2 + 1, v.target.value)}/>
                    {i != 0 && i == liftData.length / 2 - 1 && <button onClick={() => removeInput(2)}>Remove Set</button>}
                </React.Fragment>
            ))}
            <br/>
            <button onClick={() => addInput([liftData.length / 2 != 0 ? liftData[0] : "", ""])}>Add Set</button>
            <button onClick={() => finalize(false)}>Finished Set</button>
            <button onClick={() => finalize(true)}>Cancel Set</button>
            <br/>
            <WorkoutsList workouts={workoutData.lastWorkoutOfType.filter(v => v.name === name)} title={"Last Time You Did This"}/>
            </>
        )}
        <div/>
            <WorkoutsList workouts={workouts} title={"Session Exercises:"}/>
        <div/>
            <button onClick={finish}>Finish Workout</button>
        </>
    );
}