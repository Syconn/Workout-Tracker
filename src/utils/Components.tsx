export function EditableDropDown({ workouts } : { workouts: string[] }) {
    return (
        <>
        <input type="text" name="product" list="productName" />
        <datalist id="workoutNames">
        {workouts.map((val, ind) => (<option key={ind} value={val}/>))}
        </datalist>
        </>
    );
}