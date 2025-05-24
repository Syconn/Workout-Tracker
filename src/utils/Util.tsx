import { useCallback, useState } from "react";

function useSetProp<T>(setState: React.Dispatch<React.SetStateAction<T>>): <K extends keyof T>(key: K, value: T[K]) => void {
    return useCallback<<K extends keyof T>(key: K, value: T[K]) => void>(
      (key, value) => { setState(prev => ({...prev, [key]: value}));}, [setState]
    );
}

export function useTypeState<T>(val: T | (() => T)): [T, <K extends keyof T>(key: K, value: T[K]) => void] {
    const [state, setState] = useState(val);
    return [state, useSetProp(setState)];
}

export function useArrayState<T>(val: T[] | (() => T[])): [T[], (add: T) =>  void, (remove: T)=>void] {
    const [get, set] = useState(val);

    const add = (add: T) => {
        if (add && !get.includes(add)) set([...get, add]);
    };

    const remove = (remove: T) => {
        set(get.filter(w => w !== remove));
    };

    return [get, add, remove];
}

export function capitalize(s: string): string {
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