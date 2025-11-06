import { API } from '../config.ts';

export async function getRequest(route: string) {
    try {
        const res = await fetch(`${API}?route=${route}`, {
            method: "GET"
        });
        return (await res.json())
    } catch (e) {
        console.error(e)
    }
}

export async function postRequest(route: string, body: Record<string, string | number>) { // Routes result in CORS issues
    try {
        const res = await fetch(`${API}`, {
            redirect: "follow",
            method: "POST",
            headers: { "Content-Type": "text/plain",},
            body: JSON.stringify({ ...body, "route": route }),
        });

        return await res.json()
    } catch (e) {
        console.error(e);
    }
}