import {ModifyUserData, Registration} from "./networkData.ts";
import {URL} from "../utils/constants.ts"

export async function loginClient(username: string, password: string, rememberMe: boolean, setLoggedIn: (val: boolean) => void) {
    const res = await fetch(URL + "/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password, long: rememberMe ? 30 : 1 }),
    });

    const body = await res.json();
    if (!res.ok) console.log(body.error || "Login failed");
    if (res.ok) setLoggedIn(true);
    return res.ok;
}

export async function logoutClient(setLoggedIn: (val: boolean) => void) {
    const res = await fetch(URL + "/auth/logout", {
        method: "POST",
        credentials: "include"
    })

    const body = await res.json();
    if (!res.ok) console.log(body.error || "Logout failed");
    if (res.ok) setLoggedIn(false);
    return res.ok;
}

export async function registerClient(data: Registration, setLoggedIn: (val: boolean) => void) {
    const res = await fetch(URL + "/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const body = await res.json();
    if (!res.ok) console.log(body.error || "Registration failed");
    if (res.ok) setLoggedIn(true);
    return res.ok;
}

export async function validateUsername(username: string) {
    const res = await fetch(URL + "/auth/validate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    })

    const body = await res.json();
    if (res.ok) return body.value
    return false
}

export async function changePasswordClient(data: ModifyUserData) {
    const res = await fetch(URL + "/auth/changePassword", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const body = await res.json();
    if (!res.ok) console.log(body.error || "Registration failed");
    return res.ok ? true : body.error;
}

export async function checkAuth() {
    const res = await fetch(URL + "/auth/me", {credentials: "include"});
    return res.ok;
}
