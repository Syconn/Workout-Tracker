import './App.css'
import {useEffect, useState} from "react";
import {NoAccount, Pages} from "./utils/Constants.ts";
import HomeMenu from "./pages/home/Home.tsx";
import {AccountData, AccountManager, ForgetPasswordMenu, LoginMenu, RegisterMenu} from "./pages/accounts/AccountManager.tsx";
import {Routes, Route, HashRouter, Navigate} from 'react-router-dom';
import {postRequest} from "./networking/WebRequests.tsx";

function App() {
	const [account, setAccount] = useState<AccountData>(() => {
		const local = localStorage.getItem("account");
		const session = localStorage.getItem("account");
		return local ? JSON.parse(local) : session ? JSON.parse(session) : NoAccount;
	});

	const [offline, setOffline] = useState<boolean>(true);

	useEffect(() => {
		const handle = () => {
			postRequest("offline").then(result => {
				if (result?.result === "success") setOffline(false);
				console.log(result);
			});
		}

		handle()

		if (offline) {
			const interval = setInterval(handle, 5000);
			return () => clearInterval(interval);
		}
		return;
	}, [offline])

	return (
		<HashRouter>
			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account} setAccount={setAccount} />} />
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