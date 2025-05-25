import { PageProps } from "../App";
import { WorkoutsList } from "../utils/Components";
import { AuthContext } from "./Signin";
import { WorkoutData } from "./Workouts";

type Props = PageProps & {
    auth: AuthContext;
    workoutData: WorkoutData;
};

function HomeMenu({ setPage, auth, workoutData }: Props) {
    return (
        <>
        Hello, {auth.name}
        <div></div>
        <button onClick={() => setPage("track")}>Track Workout</button>
        <div></div>
        <WorkoutsList workouts={workoutData.lastWorkoutOfType} title={"Last Exercises:"}/>
        </>
    );
}

export default HomeMenu;