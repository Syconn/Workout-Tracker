import {useNavigate} from "react-router-dom";
import {Pages} from "../utils/Constants.ts";
import {useEffect} from "react";
import {AccountData} from "./accounts/AccountManager.tsx";

function HomeMenu({ account }: { account: AccountData | null }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (account === null) navigate(`${Pages.AccountManager}`)
    }, [navigate, account]);

    return (
        <>
            Hello {account?.name}!
            <div />
            Workout Tracker
            <button>Track A Workout</button>
            <button>History</button>
        </>
    )
}

export default HomeMenu;