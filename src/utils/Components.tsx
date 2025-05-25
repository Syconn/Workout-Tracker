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
            {workouts.length > 0 && title}
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

export function combinePriority(arr1: Workout[], arr2: Workout[]): Workout[] {
    return [...arr1, ...arr2.filter(v => !arr1.map(v => v.name).includes(v.name))];
}

function generateRep(rep: Reps): string {
    let output: string = rep.weight + " lbs : " + rep.reps + " reps";
    return output;
}