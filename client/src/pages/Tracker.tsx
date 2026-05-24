import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pages} from "../utils/data.ts";

export function Tracker({ loggedIn }: { loggedIn: boolean | null }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn === false) navigate(`${Pages.AccountManager}`)
    });

    return <Outlet/>
}