import { useState } from "react";
import { WorkoutData } from "./Workouts";
import { WorkoutsList } from "../utils/Components";

export function HistoryMenu({data, setPage}: {data: WorkoutData, setPage: (s: string) => void}) {
    const [number, setNumber] = useState(0);
    const session = data.lifts[number];

    if (data.lifts[number] == null) return (
        <>
        <button onClick={() => setPage("home")}>Home</button>
        <div/>
        No Tracked Workouts
        </>
    )

    return (
        <>
        <button onClick={() => setNumber(number - 1 < 0 ? data.lifts.length - 1 : number - 1)}>{"<<"}</button>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setNumber((number + 1) % data.lifts.length)}>{">>"}</button>
        <label>{" Page " + (number + 1) + " of " + data.lifts.length}</label>
        <div/>
        <label>{(session.program ? session.program : "Program") + " Day"}</label>
        <label>{" on " + new Date(session.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</label>
        <label>{" for " + Number(data.lifts[number].time).toFixed(2) + " Minutes"}</label>
        <WorkoutsList workouts={session.workouts} title={""} />
        </>
    );
}