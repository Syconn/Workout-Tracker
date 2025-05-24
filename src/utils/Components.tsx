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
            {title}
            {workouts.map(v => (<WorkoutList workout={v}/>))}
        </dl>
        </>
    );
}

function WorkoutList({ workout }: { workout: Workout }) {
    return (
        <>
        <dt>{workout.name + ":"}</dt>
        {workout.reps.map(v => (<dd>{generateRep(v)}</dd>))}
        </>
    );
}

function generateRep(rep: Reps): string {
    let output: string = rep.weight + ": " + rep.reps;
    if (rep.superset != null) output += " | " +  generateRep(rep.superset);
    return output;
}