import './App.css'
import {useEffect, useState} from "react";
import {NoAccount, NoSavedWorkouts, NoWorkout, Pages, SerializedWorkouts} from "./utils/Constants.ts";
import HomeMenu from "./pages/home/Home.tsx";
import {
	AccountData,
	AccountManager,
	ForgetPasswordMenu,
	LoginMenu,
	RegisterMenu
} from "./pages/accounts/AccountManager.tsx";
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';
import {Profile} from "./pages/profile/Profile.tsx";
import {useTypeState} from "./utils/Util.tsx";
import {ExerciseSearch, Track, TrackedWorkout, Tracker, TrackerStart, Workouts} from "./pages/tracker/Tracker.tsx";
import {DB} from "./utils/database.ts";

function App() {
	const [account, setAccount] = useState<AccountData>(() => {
		const local = localStorage.getItem("account")
		const session = sessionStorage.getItem("account")
		return local ? JSON.parse(local) : session ? JSON.parse(session) : NoAccount
	})

	// const [workouts, setWorkoutProp] = useTypeState<Workouts>(() => {
	// 	const local = localStorage.getItem("workouts")
	// 	if (!local) return NoSavedWorkouts
	// 	const parsed = JSON.parse(local)
	// 	return {...parsed, lastLifted: new Map(parsed.lastLifted), recordLift: new Map(parsed.recordLift) }
	// })

	const [trackedWorkout, setTrackedWorkoutProp, setTrackedWorkout] = useTypeState<TrackedWorkout>(() => {
		const local = localStorage.getItem("trackedWorkout")
		return local ? JSON.parse(local) : NoWorkout
	})

	const [workouts, setWorkoutProp] = useState<Workouts>(NoSavedWorkouts)

	useEffect(() => {
		let cancelled = false

		async function loadWorkouts() {
			const record = await DB.workouts.get("main")
			if (!record || cancelled) return

			setWorkoutProp(record.data)
		}

		loadWorkouts()

		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		if (trackedWorkout != NoWorkout) localStorage.setItem("trackedWorkout", JSON.stringify(trackedWorkout))
	}, [trackedWorkout]);

	// useEffect(() => {
	// 	if (workouts === NoSavedWorkouts) return
	// 	const serializable: SerializedWorkouts = {...workouts, lastLifted: Array.from(workouts.lastLifted.entries()), recordLift: Array.from(workouts.recordLift.entries()) }
	// 	localStorage.setItem("workouts", JSON.stringify(serializable))
	// }, [workouts])

	useEffect(() => {
		if (workouts === NoSavedWorkouts) return

		DB.workouts.put({
			id: "main",
			data: workouts
		})
	}, [workouts])

	const saveWorkout = () => {
		const prev = structuredClone(workouts.workouts)
		prev.push(trackedWorkout)
		setWorkoutProp("workouts", prev)

		trackedWorkout.lifts.forEach((lift, liftIndex) => {
			const map = structuredClone(workouts.lastLifted)
			map.set(lift.exercise_id, [workouts.workouts.length, liftIndex])
			setWorkoutProp("lastLifted", map)

			lift.set.forEach((set, setIndex) => {
				if (workouts.recordLift.has(lift.exercise_id)) {
					const bestArr = workouts.recordLift.get(lift.exercise_id)
					if (bestArr !== undefined) {
						const best = workouts.workouts[bestArr[0]].lifts[bestArr[1]].set[bestArr[2]]

						if (best.weight > set.weight) return;
						if (best.weight === set.weight && best.reps > set.reps) return;
					}
				}

				const map = structuredClone(workouts.recordLift)
				map.set(lift.exercise_id, [workouts.workouts.length, liftIndex, setIndex])
				setWorkoutProp("recordLift", map)
			})
		})

		localStorage.removeItem("trackedWorkout")
		sessionStorage.removeItem("lift")
		setTrackedWorkout(NoWorkout)
	}

	// useEffect(() => { TODO FIX  WHY REFRESHING KILLS IT
	// 	if (account === NoAccount) return;
	//
	// 	let cancelled = false;
	//
	// 	(async () => {
	// 		const validated = await validateSession(account);
	// 		if (!cancelled) {
	// 			setAccount(validated);
	// 			if (validated === NoAccount) logout(setAccount);
	// 		}
	// 	})();
	//
	// 	return () => {
	// 		cancelled = true;
	// 	};
	// }, [account]);



	return (
		<HashRouter>
			{/*<OfflinePopup />*/}

			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account} />} />
				<Route path={Pages.ProfilePage} element={<Profile account={account} setAccount={setAccount} />} />
				<Route path={Pages.TrackerPage} element={<Tracker account={account} />} >
					<Route index element={<Navigate to={Pages.StartPage} replace />} />
					<Route path={Pages.StartPage} element={<TrackerStart workout={trackedWorkout} setWorkoutProp={setTrackedWorkoutProp} setWorkout={setTrackedWorkout} saveWorkout={saveWorkout} />} />
					<Route path={Pages.TrackPage} element={<Track workout={trackedWorkout} pastWorkout={workouts} setWorkoutProp={setTrackedWorkoutProp} setWorkout={setTrackedWorkout} saveWorkout={saveWorkout} />} />
					<Route path={Pages.SearchPage} element={<ExerciseSearch />} />
				</Route>
				<Route path={Pages.AccountManager} element={<AccountManager account={account} />}>
					<Route index element={<Navigate to={Pages.LoginPage} replace />} />
					<Route path={Pages.LoginPage} element={<LoginMenu setAccount={setAccount} />} />
					<Route path={Pages.RegisterPage} element={<RegisterMenu setAccount={setAccount} />} />
					<Route path={Pages.ForgotPage} element={<ForgetPasswordMenu />} />
				</Route>
				<Route path="*" element={<Navigate to={Pages.HomePage} replace />} />
			</Routes>
		</HashRouter>
	);
}

export default App