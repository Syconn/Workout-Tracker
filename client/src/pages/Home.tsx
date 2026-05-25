import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pages} from "../utils/data.ts";

function Home({loggedIn}: { loggedIn: boolean | null }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log(loggedIn);
        if (loggedIn === false) navigate(Pages.AccountManager);
        if (location.pathname === "/") navigate(Pages.Home);
    });

    return <Outlet />
}

export default Home;