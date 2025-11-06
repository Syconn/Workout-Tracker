import './App.css'
import {useState} from "react";
import {Pages} from "./utils/Constants.ts";
import HomeMenu from "./pages/Home.tsx";
import AccountManager, {AccountData} from "./pages/accounts/AccountManager.tsx";
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
	const [account, setAccount] = useState<AccountData | null>(null);

	return (
		<BrowserRouter basename="/Workout-Tracker">
			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account}/>} />
				<Route path={`${Pages.AccountManager}/*`} element={<AccountManager setAccount={v => setAccount(v)} />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App