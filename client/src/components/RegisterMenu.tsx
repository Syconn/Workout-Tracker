import React, {useEffect, useState} from "react";
import {Eye, EyeOff, Loader2, Lock, Mail, User} from "lucide-react";
import styles from "../styles/AccountManager.module.css"
import {Link} from "react-router-dom";
import {useDebounce} from "../utils/util.ts";
import {registerClient, validateUsername} from "../network/authRequests.ts";
import {Pages} from "../utils/constants.ts";

function RegisterMenu({ setLoggedIn } : { setLoggedIn: (login: boolean) => void }) {
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [validUsername, setValidUsername] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorField, setErrorField] = useState<string>("");

    const passwordsMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
    const debouncedText = useDebounce(username, 1000);

    const register = async () => {
        const valid = await validateUsername(username);
        if (!valid) {
            setValidUsername(false);
            setErrorField("usernameTaken");
            return;
        }

        if (!name.trim()) {
            setErrorField("name");
            return;
        }
        if (!email.trim()) {
            setErrorField("email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorField("emailInvalid");
            return;
        }

        if (!username.trim() || username.includes(" ")) {
            setErrorField("username");
            return;
        }

        if (!password.trim()) {
            setErrorField("password");
            return;
        }

        if (!passwordConfirm.trim()) {
            setErrorField("passwordConfirm");
            return;
        }

        if (password !== passwordConfirm) {
            setErrorField("passwordMismatch");
            return;
        }

        setErrorField("");
        await registerClient({name, email, username, password}, setLoggedIn)
    };

    const handleInput = (field: string, setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errorField === field) setErrorField("");
    };

    useEffect(() => {
        if (!debouncedText) return;

        if (username === "" || username.includes(" ")) {
            setCheckingUsername(false);
            return;
        }

        let cancelled = false;
        async function checkUsername() {
            try {
                setCheckingUsername(true);

                const res = await validateUsername(username);

                if (!cancelled) {
                    setValidUsername(res);
                    setErrorField(res ? "" : "usernameTaken");
                }
            } finally {
                if (!cancelled) setCheckingUsername(false);
            }
        }

        void checkUsername();

        return () => {
            cancelled = true;
        };

    }, [debouncedText, username]);

    return (
        <div className={styles.background}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Register</h2>

                <form>
                    <div className={styles.inputGroup}>
                        <User className={styles.icon} size={18} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            autoComplete="name"
                            className={styles.input}
                            onChange={handleInput("name", setName)}
                        />
                    </div>
                    {errorField === "name" && (
                        <p className={styles.errorText}>Please enter your name.</p>
                    )}

                    <div className={styles.inputGroup}>
                        <Mail className={styles.icon} size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            className={styles.input}
                            onChange={handleInput("email", setEmail)}
                        />
                    </div>
                    {errorField === "email" && (<p className={styles.errorText}>Please enter a valid email.</p>)}
                    {errorField === "emailInvalid" && (<p className={styles.errorText}>Please enter a valid email address.</p>)}

                    <div className={styles.inputGroup}>
                        <User className={styles.icon} size={18} />
                        <input
                            type="text"
                            placeholder="Username"
                            className={styles.input}
                            onChange={handleInput("username", setUsername)}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                        />
                    </div>
                    {checkingUsername && username.trim() && (
                        <p className={styles.infoText}>
                            <Loader2 className={styles.spinner} size={14} />
                            Checking availability...
                        </p>
                    )}
                    {(validUsername && isUsernameFocused && !checkingUsername && username !== "") && (
                        <p className={styles.successText}>✓ Username is available!</p>
                    )}
                    {(!checkingUsername && !validUsername && errorField == "usernameTaken") && (
                        <p className={styles.errorText}>Username is already taken.</p>
                    )}
                    {errorField === "username" && (
                        <p className={styles.errorText}>Please choose a username.</p>
                    )}

                    <div className={styles.inputGroup}>
                        <Lock className={styles.icon} size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="new-password"
                            className={styles.input}
                            onChange={handleInput("password", setPassword)}
                        />
                        <div
                            className={styles.eyeArea}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                        >
                            {showPassword ? (<Eye className={styles.eyeIcon} size={18} />) : (<EyeOff className={styles.eyeIcon} size={18} />)}
                        </div>
                    </div>
                    {errorField === "password" && (<p className={styles.errorText}>Please enter a password.</p>)}

                    <div className={styles.inputGroup}>
                        <Lock className={styles.icon} size={18} />
                        <input type="password" placeholder="Confirm Password" className={styles.input}
                               autoComplete="new-password"
                               onChange={handleInput("passwordConfirm", setPasswordConfirm)}
                        />
                    </div>
                    {errorField === "passwordConfirm" && (<p className={styles.errorText}>Please confirm your password.</p>)}
                    {(passwordsMismatch || errorField === "passwordMismatch") && (<p className={styles.errorText}>⚠ Passwords do not match.</p>)}

                    <button className={styles.loginButton} onClick={register}>Register</button>

                    <div className={styles.footer}>
                        Already have an account?
                        <Link to={`../${Pages.LoginPage}`}> Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterMenu