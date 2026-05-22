export async function postRequest(route: string, body: Record<string, string | number> = {}) { // Routes result in CORS issues
    try {
        const res = await fetch(`https://script.google.com/macros/s/AKfycbwR32HZDJAnN35aIsOFSdUKdrteL-AO9rtS96t0ehIgHUJstYuINpJWuMDPW_FLeRxRAw/exec`, {
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