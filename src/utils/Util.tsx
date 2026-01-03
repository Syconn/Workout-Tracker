import React, {useCallback, useEffect, useState} from "react";
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

function useSetProp<T>(setState: React.Dispatch<React.SetStateAction<T>>): <K extends keyof T>(key: K, value: T[K]) => void {
    return useCallback<<K extends keyof T>(key: K, value: T[K]) => void>(
        (key, value) => { setState(prev => ({...prev, [key]: value}));}, [setState]
    );
}

export function useTypeState<T>(val: T | (() => T)): [T, <K extends keyof T>(key: K, value: T[K]) => void] {
    const [state, setState] = useState(val);
    return [state, useSetProp(setState)];
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

export function getExerciseImage(images: string[]) {
    return {
        start: `images/${images[0]}`,
        end: `images/${images[1]}`
    };
}

export function capitalize(s: string): string {
    if (s === null) return "None"
    let r: string = "";
    for (let i = 0; i < s.length; i++) {
        if (i == 0) r += s[0].toLocaleUpperCase();
        else {
            if (s[i - 1] == " ") r += s[i].toLocaleUpperCase();
            else r += s[i].toLocaleLowerCase();
        }
    }
    return r;
}