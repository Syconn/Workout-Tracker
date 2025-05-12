import { useEffect, useState } from 'react'
import { AuthContext, SignupMenu } from './pages/Signin';
import { useSetProp } from './utils/Util';
import './App.css'
import HomeMenu from './pages/Home';
import { WorkoutTrackerMenu } from './pages/Workouts';

export type PageProps = {
	setPage: (auth: string) => void;
}

function App() {
	const [authContext, setAuthContext] = useState<AuthContext>(() => {
		const stored = localStorage.getItem("authContext");
		return stored ? JSON.parse(stored) : { name: "", email: "" };
	});
	const setAuth = useSetProp(setAuthContext);
	const [page, setPage] = useState(authContext.name.length == 0 ? "signup" : "home");

	useEffect(() => {
		localStorage.setItem("authContext", JSON.stringify(authContext));
	}, [authContext]);

	return (
		<>
		{page == "home" && <HomeMenu setPage={setPage} auth={authContext} />}
		{page == "signup" && <SignupMenu setPage={setPage} setAuth={setAuth} />}
		{page == "track" && <WorkoutTrackerMenu />}
		</>
  	)
}

export default App