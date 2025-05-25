import { useEffect, useState } from 'react'
import { AuthContext, SignupMenu } from './pages/Signin';
import { WorkoutTrackerMenu } from './pages/Workouts';
import HomeMenu from './pages/Home';
import './App.css'
import { useTypeState } from './utils/Util';

export type Page = {
	page: string;
}

export type PageProps = {
	setPage: (auth: string) => void;
}

function App() {
	const [authContext, setAuthContext] = useTypeState<AuthContext>(() => {
		const stored = localStorage.getItem("authContext");
		return stored ? JSON.parse(stored) : { name: "", email: "", data: {lifts: [], lastWorkoutOfType: []} };
	});
	const [page, setPage] = useTypeState<Page>(() => {
		const stored = localStorage.getItem("page");
		return stored ? JSON.parse(stored) : { "page": authContext.name.length == 0 ? "signup" : "home"};
	});

	useEffect(() => localStorage.setItem("authContext", JSON.stringify(authContext)), [authContext]);
	useEffect(() => localStorage.setItem("page", JSON.stringify(page)), [page]);

	return (
		<>
		{page.page == "home" && <HomeMenu setPage={p => setPage("page", p)} auth={authContext} workoutData={authContext.data} />}
		{page.page == "signup" && <SignupMenu setPage={p => setPage("page", p)} setAuth={setAuthContext} />}
		{page.page == "track" && <WorkoutTrackerMenu setPage={p => setPage("page", p)} workoutData={authContext.data} modifyWorkoutData={setAuthContext} />}
		</>
  	)
}

export default App