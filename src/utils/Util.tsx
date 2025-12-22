import {useEffect, useState} from "react";
import {postRequest} from "../networking/WebRequests.tsx";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function useOnlineStatus() {
    const [offline, setOffline] = useState<boolean>(true)

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