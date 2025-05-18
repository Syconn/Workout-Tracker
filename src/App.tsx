import { useCallback, useEffect, useState } from 'react'
import { AuthContext, SignupMenu } from './pages/Signin';
import { useSetProp } from './utils/Util';
import './App.css'
import HomeMenu from './pages/Home';
import { WorkoutData, WorkoutTrackerMenu } from './pages/Workouts';

export type PageProps = {
	setPage: (auth: string) => void;
}

function App() {
	const [authContext, setAuthContext] = useState<AuthContext>(() => {
		const stored = localStorage.getItem("authContext");
		return stored ? JSON.parse(stored) : { name: "", email: "" };
	});
	const [page, setPage] = useState(authContext.name.length == 0 ? "signup" : "home");
	const setAuth = useSetProp(setAuthContext);
	const [workoutData, modifyWorkoutData] = useState<WorkoutData>(authContext.data);
	const setWorkoutData = useSetProp(modifyWorkoutData);

	useEffect(() => localStorage.setItem("authContext", JSON.stringify(authContext)), [authContext]);
	useEffect(() => setAuth("data", workoutData), [setAuth, workoutData]);

	return (
		<>
		{page == "home" && <HomeMenu setPage={setPage} auth={authContext} />}
		{page == "signup" && <SignupMenu setPage={setPage} setAuth={setAuth} />}
		{page == "track" && <WorkoutTrackerMenu workoutData={workoutData} modifyWorkoutData={setWorkoutData} />}
		</>
  	)
}

export default App