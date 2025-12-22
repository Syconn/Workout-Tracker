import './App.css'
import {useEffect, useState} from "react";
import {NoAccount, Pages} from "./utils/Constants.ts";
import HomeMenu from "./pages/home/Home.tsx";
import {
	AccountData,
	AccountManager,
	ForgetPasswordMenu,
	LoginMenu,
	RegisterMenu
} from "./pages/accounts/AccountManager.tsx";
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';
import {OfflinePopup} from "./utils/Popups.tsx";
import {Profile} from "./pages/profile/Profile.tsx";
import {logout, validateSession} from "./utils/Util.tsx";

function App() {
	const [account, setAccount] = useState<AccountData>(() => {
		const local = localStorage.getItem("account")
		const session = sessionStorage.getItem("account")
		return local ? JSON.parse(local) : session ? JSON.parse(session) : NoAccount
	})

	useEffect(() => {
		if (account === NoAccount) return;

		let cancelled = false;

		(async () => {
			const validated = await validateSession(account);
			if (!cancelled) {
				setAccount(validated);
				if (validated === NoAccount) logout(setAccount);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [account]);


	return (
		<HashRouter>
			<OfflinePopup />

			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account} />} />
				<Route path={Pages.ProfilePage} element={<Profile account={account} setAccount={setAccount} />} />
				<Route path={Pages.AccountManager} element={<AccountManager account={account} />}>
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