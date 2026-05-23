import {useEffect, useState} from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function getExerciseImage(images: string[]) {
    return {
        start: `images/${images[0]}`,
        end: `images/${images[1]}`
    };
}

export function capitalize(s: string): string {
    if (s === undefined) return "None"
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