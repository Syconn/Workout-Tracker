import './App.css'
import {Pages} from "./utils/constants.ts";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LoginMenu from "./components/LoginMenu.tsx";
import RegisterMenu from "./components/RegisterMenu.tsx";
import {useEffect, useState} from "react";
import AccountManager from "./pages/AccountManager.tsx";
import {UNLOADED_USER, UserData} from "./network/networkData.ts";
import {userInfo} from "./network/userRequests.ts";
import Home from "./pages/Home.tsx";
import HomeMenu from "./components/HomeMenu.tsx";
import {checkAuth} from "./network/authRequests.ts";
import {Profile} from "./pages/Profile.tsx";

function App() {
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
	const [userData, setUserData] = useState<UserData>(UNLOADED_USER);

	useEffect(() => {
		const loadData = async () => {
			setLoggedIn(await checkAuth())
			setUserData(await userInfo())
		}
		void loadData()
	}, [loggedIn]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path={Pages.Main} element={<Home loggedIn={loggedIn} />} >
					<Route path={Pages.Home} element={<HomeMenu userData={userData} />} />
				    <Route path={Pages.ProfilePage} element={<Profile setLoggedIn={setLoggedIn} />} />
                    {/*<Route path={Pages.TrackerPage} element={<Tracker account={account} />} >*/}
                    {/*	<Route index element={<Navigate to={Pages.StartPage} replace />} />*/}
                    {/*	<Route path={Pages.StartPage} element={<TrackerStart workout={trackedWorkout} setWorkoutProp={setTrackedWorkoutProp} setWorkout={setTrackedWorkout} saveWorkout={saveWorkout} />} />*/}
                    {/*	<Route path={Pages.TrackPage} element={<Track workout={trackedWorkout} pastWorkout={workouts} setWorkoutProp={setTrackedWorkoutProp} setWorkout={setTrackedWorkout} saveWorkout={saveWorkout} />} />*/}
                    {/*	<Route path={Pages.SearchPage} element={<ExerciseSearch />} />*/}
                    {/*</Route>*/}
                </Route>

				<Route path={Pages.AccountManager} element={<AccountManager loggedIn={loggedIn} />}>
					<Route index element={<Navigate to={Pages.LoginPage} replace />} />
					<Route path={Pages.LoginPage} element={<LoginMenu setLoggedIn={setLoggedIn} />} />
					<Route path={Pages.RegisterPage} element={<RegisterMenu setLoggedIn={setLoggedIn} />} />
					{/*<Route path={Pages.ForgotPage} element={<ForgetPasswordMenu />} />*/}
				</Route>
				<Route path="*" element={<Navigate to={Pages.AccountManager} replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App