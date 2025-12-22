import './App.css'
import {useState} from "react";
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

function App() {
	const [account, setAccount] = useState<AccountData>(() => {
		const local = localStorage.getItem("account")
		const session = sessionStorage.getItem("account")
		return local ? JSON.parse(local) : session ? JSON.parse(session) : NoAccount
	})

	return (
		<HashRouter>
			<OfflinePopup />

			<Routes>
				<Route path={Pages.HomePage} element={<HomeMenu account={account} setAccount={setAccount} />} />
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