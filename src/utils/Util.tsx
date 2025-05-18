import { useCallback, useState } from "react";

export function useSetProp<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
    return useCallback<<K extends keyof T>(key: K, value: T[K]) => void>(
      (key, value) => { setState(prev => ({...prev, [key]: value}));}, [setState]
    );
}

export function useArrayState<T>(val: T[] | (() => T[])): [T[], (add: T)=>void, (remove: T)=>void] {
    const [get, set] = useState(val);

    const add = (add: T) => {
        if (add && !get.includes(add)) set([...get, add]);
    };

    const remove = (remove: T) => {
        set(get.filter(w => w !== remove));
    };

    return [get, add, remove];
}