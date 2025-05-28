import { useEffect, useRef, useState } from "react";
import { Reps, Workout } from "../pages/Workouts";

export function EditableDropDown({ workouts, value, setChange }: { workouts: string[], value: string, setChange: (s: string) => void }) {
    return (
        <>
        <input type="text" list="workoutNames" value={value} onChange={v => setChange(v.target.value)}/>
        <datalist id="workoutNames">
            {workouts.map((val, ind) => (<option key={ind} value={val}/>))}
        </datalist>
        </>
    );
}

export function WorkoutsList({ workouts, title }: { workouts: Workout[], title: string }) {
    return (
        <>
        <dl>
            {workouts.length > 0 && title !== "" && title}
            {workouts.map((v, i) => (<WorkoutList workout={v} key={i}/>))}
        </dl>
        </>
    );
}

function WorkoutList({ workout }: { workout: Workout }) {
    return (
        <>
        <dt>{workout.name + ":"}</dt>
        {workout.reps.map((v, i) => (<dd key={i}>{generateRep(v)}</dd>))}
        </>
    );
}

export function AutoWidthInput({note, value, setValue}: {note: string, value: string, setValue: (s: string) => void}) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (spanRef.current && inputRef.current) {
        const spanWidth = spanRef.current.offsetWidth;
        inputRef.current.style.width = `${spanWidth + 10}px`;
        }
    }, [value]);

    return (
        <div className="inline-block relative">
        <label>{note}</label>
        <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} className="border px-1 text-base" style={{ font: 'inherit' }}/>
        <span ref={spanRef} style={{position: 'absolute', top: 0, left: 0, visibility: 'hidden', whiteSpace: 'pre', font: 'inherit'}}>{value || ' '}</span>
        </div>
    );
}

export function combinePriority(arr1: Workout[], arr2: Workout[]): Workout[] {
    return [...arr1, ...arr2.filter(v => !arr1.map(v => v.name).includes(v.name))];
}

function generateRep(rep: Reps): string {
    let output: string = rep.weight + " lbs : " + rep.reps + " reps";
    return output;
}