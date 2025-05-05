import { useState } from "react";

type PageProp = {
    setPage: (auth: string) => void;
};

type SignupMenuProps = PageProp & {
    setAuth: <K extends keyof AuthContext>(key: K, value: AuthContext[K]) => void;
};

export interface AuthContext {
    username: string,
    password: string,
    name: string,
    email: string;
}

export function LoginMenu({ setPage }: PageProp) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>/
        Login Screen
        <div />
            Username: 
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <div />
            Password: 
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div />
            {/* <input type="button" value={"Login"} onClick={() => setPage("home")} /> */}
            <input type="button" value={"Sign Up"} onClick={() => setPage("signup")} />
        </>
    );
}

export function SignupMenu({ setPage, setAuth }: SignupMenuProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const handleSignup = () => {

    }

    return (
        <>
        Signup Screen
        <div />
            Full Name: 
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <div />
            Email: 
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <div />
            Username: 
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <div />
            Password: 
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div />
            Confirm Password: 
            <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
        <div />
            <input type="button" value={"Login"} />
            <input type="button" value={"Sign Up"} onChange={handleSignup} />
        {"HEELLo"}
        </>
    );
}