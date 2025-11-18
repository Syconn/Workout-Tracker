import './App.css'
import {useState} from "react";
import {NoAccount, Pages} from "./utils/Constants.ts";
import HomeMenu from "./pages/Home.tsx";
import {AccountData, AccountManager, ForgetPasswordMenu, LoginMenu, RegisterMenu} from "./pages/accounts/AccountManager.tsx";
import {Routes, Route, HashRouter, Navigate} from 'react-router-dom';

function App() {
	const [account, setAccount] = useState<AccountData>(() => {
		const stored = localStorage.getItem("account");
		return stored ? JSON.parse(stored) : NoAccount;
	});

	return (
		<HashRouter>
			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account} />} />
				<Route path={Pages.AccountManager} element={<AccountManager />}>
					<Route index element={<Navigate to="login" replace />} />
					<Route path={Pages.LoginPage} element={<LoginMenu setAccount={setAccount} />} />
					<Route path={Pages.RegisterPage} element={<RegisterMenu setAccount={setAccount} />} />
					<Route path={Pages.ForgotPage} element={<ForgetPasswordMenu />} />
				</Route>
			</Routes>
		</HashRouter>
	);
}

export default App