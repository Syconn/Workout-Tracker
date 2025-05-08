import { useState } from "react";
import { PageProps } from "../App";

type UserProps = PageProps & {
    setAuth: <K extends keyof AuthContext>(key: K, value: AuthContext[K]) => void;
};

export interface AuthContext {
    name: string,
    email: string;
}

export function SignupMenu({ setPage, setAuth }: UserProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSignup = () => {
        if (name == "") {
            setError("Missing Name");
            return;
        } else if (email == "") {
            setError("Missing Email");
            return;
        }
        setAuth("name", name);
        setAuth("email", email);
        setPage("home");
    }

    return (
        <>
        Signup Menu
        <div />
            Name: 
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
        <div />
            Email: 
            <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} />
        <div />
            <input type="button" value={"Sign Up"} onClick={handleSignup} />
        <div />
        {error}
        </>
    );
}