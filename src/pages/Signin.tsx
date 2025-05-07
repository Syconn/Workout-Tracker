import { useState } from "react";

type UserProps = {
    setPage: (auth: string) => void;
    setAuth: <K extends keyof AuthContext>(key: K, value: AuthContext[K]) => void;
};

export interface AuthContext {
    username: string,
    password: string,
    name: string,
    email: string;
}

export function SignupMenu({ setPage, setAuth }: UserProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSignup = () => {
        
    }

    return (
        <>
        Signup Screen
        <div />
            Name: 
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <div />
            Email: 
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <div />
            <input type="button" value={"Sign Up"} onClick={handleSignup} />
        <div />
        {error}
        </>
    );
}