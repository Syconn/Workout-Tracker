import {useEffect, useState} from "react";
import {postRequest} from "../networking/WebRequests.tsx";
import {AccountData} from "../pages/accounts/AccountManager.tsx";
import {NoAccount, Requests} from "./Constants.ts";

export function logout(setAccount: (v: AccountData) => void, check: boolean = false)  {
    if (check&& !confirm("Are you sure you want to log out?")) return;

    setAccount(NoAccount);
    localStorage.removeItem("account")
    sessionStorage.removeItem("account")

    alert("You have been logged out") // Temp
}

export async function validateSession(account: AccountData) {
    if (account === NoAccount) return account;
    return postRequest(Requests.ValidSession, { id: account.id, authToken: account.accessToken }).then(v => {
        if (v.result) return account
        return NoAccount
    }).catch(err => {
        console.error(err);
        return NoAccount
    })
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function useOnlineStatus() {
    const [offline, setOffline] = useState<boolean>(false)

    useEffect(() => {
        const handle = () => {
            postRequest("offline").then(result => {
                if (result?.result === "success") setOffline(false)
            })
        }

        handle()

        if (offline) {
            const interval = setInterval(handle, 5000)
            return () => clearInterval(interval)
        }
        return
    }, [offline])

    return offline;
}