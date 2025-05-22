import { Reps, Workout } from "../pages/Workouts";

export function EditableDropDown({ workouts }: { workouts: string[] }) {
    return (
        <>
        <input type="text" list="workoutNames" />
        <datalist id="workoutNames">
            {workouts.map((val, ind) => (<option key={ind} value={val} />))}
        </datalist>
        </>
    );
}

export function WorkoutsList({ workouts }: { workouts: Workout[] }) {
    return (
        <>
        {workouts.map(v => (<WorkoutList workout={v} />))}
        </>
    );
}

function WorkoutList({ workout }: { workout: Workout }) {
    return (
        <dl>
            <dt>{workout.name}</dt>
            {workout.reps.map(v => (<dd>{generateRep(v)}</dd>))}
        </dl>
    );
}

function generateRep(rep: Reps): string {
    let output: string = rep.weight + ": " + rep.reps;
    if (rep.superset != null) output += " | " +  generateRep(rep.superset);
    return output;
}