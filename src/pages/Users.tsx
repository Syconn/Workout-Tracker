import { useState } from "react";

type LoginProps = {
    setPage: (page: string) => void;
};

export interface AuthContext {
    
}

export function LoginMenu({ setPage }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
        Login Screen
        <div />
            Username: 
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <div />
            Password: 
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div />
            <input type="button" value={"Login"} onClick={() => setPage("home")} />
            <input type="button" value={"Sign Up"} onClick={() => setPage("signup")} />
        </>
    );
}

export function SignupMenu() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
        Signup Screen
        <div />
            Username: 
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <div />
            Password: 
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div />
            <input type="button" value={"Login"} />
            <input type="button" value={"Sign Up"} />
        </>
    );
}