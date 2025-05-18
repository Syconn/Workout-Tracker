export function EditableDropDown({ workouts } : { workouts: string[] }) {
    return (
        <>
        <input type="text" list="workoutNames" />
        <datalist id="workoutNames">
            {workouts.map((val, ind) => (<option key={ind} value={val}/>))}
        </datalist>
        </>
    );
}