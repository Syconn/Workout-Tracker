import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pages} from "../utils/data.ts";

function AccountManager({ loggedIn }: { loggedIn: boolean | null }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn === true) navigate(Pages.Home)
    }, [loggedIn, navigate]);

    return <Outlet />
}

export default AccountManager;