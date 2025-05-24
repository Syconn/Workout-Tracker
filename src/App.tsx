import { useEffect, useState } from 'react'
import { AuthContext, SignupMenu } from './pages/Signin';
import { WorkoutData, WorkoutTrackerMenu } from './pages/Workouts';
import HomeMenu from './pages/Home';
import './App.css'
import { useTypeState } from './utils/Util';

export type PageProps = {
	setPage: (auth: string) => void;
}

function App() {
	const [authContext, setAuthContext] = useTypeState<AuthContext>(() => {
		const stored = localStorage.getItem("authContext");
		return stored ? JSON.parse(stored) : { name: "", email: "", data: {lifts: [], lastWorkoutOfType: []} };
	});
	const [page, setPage] = useState(authContext.name.length == 0 ? "signup" : "home");
	const [workoutData, setWorkoutData] = useTypeState<WorkoutData>(authContext.data);

	useEffect(() => localStorage.setItem("authContext", JSON.stringify(authContext)), [authContext]);
	useEffect(() => setAuthContext("data", workoutData), [setAuthContext, workoutData]);

	return (
		<>
		{/* {page == "home" && <HomeMenu setPage={setPage} auth={authContext} />}
		{page == "signup" && <SignupMenu setPage={setPage} setAuth={setAuth} />}
		{page == "track" && <WorkoutTrackerMenu workoutData={workoutData} modifyWorkoutData={setWorkoutData} />} */}

		<WorkoutTrackerMenu workoutData={workoutData} modifyWorkoutData={setWorkoutData} />
		</>
  	)
}

export default App