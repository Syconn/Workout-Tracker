import {useNavigate} from "react-router-dom";
import {NoAccount, Pages} from "../../utils/Constants.ts";
import {useEffect} from "react";
import {AccountData} from "../accounts/AccountManager.tsx";
import headerStyles from "./Header.module.css"

function HomeMenu({ account, setAccount }: { account: AccountData, setAccount: (v: AccountData) => void }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (account === NoAccount) navigate(`${Pages.AccountManager}`)
    }, [navigate, account]);

    return (
        <>
            {/*Hello {account?.name}!*/}
            {/*Workout Tracker*/}
            {/*<button>Track A Workout</button>*/}
            {/*<button>History</button>*/}
            {/*<button>Logout</button>*/}

        </>
    )
}

export default HomeMenu;