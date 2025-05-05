import { useCallback } from "react";

export function useSetProp<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
    return useCallback<<K extends keyof T>(key: K, value: T[K]) => void>(
      (key, value) => { setState(prev => ({...prev, [key]: value}));}, [setState]
    );
}