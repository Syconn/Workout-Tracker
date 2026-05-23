import {URL} from "../utils/constants.ts"

export async function userInfo() {
    const res = await fetch(URL + "/user/info", {
        credentials: "include"
    });

    const body = await res.json();
    if (!res.ok) return null;
    return body.info;
}

export async function updateInfo(name: string, email: string) {
    const res = await fetch(URL + "/user/updateInfo", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email }),
    })

    if (!res.ok) console.log("update Failed");
    return res.ok;
}