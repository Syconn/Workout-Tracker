import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pages} from "../utils/constants.ts";

function Home({loggedIn}: { loggedIn: boolean | null }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn === false) navigate(Pages.AccountManager);
    }, [loggedIn, navigate]);

    return <Outlet />
}

export default Home;