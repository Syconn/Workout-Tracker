import './App.css'
import {useState} from "react";
import {Pages} from "./utils/Constants.ts";
import HomeMenu from "./pages/Home.tsx";
import {AccountData, AccountManager, LoginMenu, RegisterMenu} from "./pages/accounts/AccountManager.tsx";
import {Routes, Route, HashRouter, Navigate} from 'react-router-dom';

function App() {
	const [account, setAccount] = useState<AccountData | null>(null);

	return (
		<HashRouter>
			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account} />} />
				<Route path={Pages.AccountManager} element={<AccountManager />}>
					<Route index element={<Navigate to="login" replace />} />
					<Route path="login" element={<LoginMenu setAccount={setAccount} />} />
					<Route path="register" element={<RegisterMenu setAccount={setAccount} />} />
				</Route>
			</Routes>
		</HashRouter>
	);
}

export default App