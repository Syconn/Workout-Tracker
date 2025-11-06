import React, {useEffect, useState} from "react";
import {User, Lock, Eye, EyeOff, Mail, Loader2} from "lucide-react";
import styles from "./AccountManager.module.css"
import {getRequest, postRequest} from "../../networking/WebRequests.tsx";
import {Pages, Requests} from "../../utils/Constants.ts";
import {Link, useNavigate, Outlet} from "react-router-dom";
import {useDebounce} from "../../utils/Util.tsx";

export type AccountData = {
    id: number
    name: string
    accessToken: string
}

export function AccountManager() {
    return (
        <>
            <Outlet />
        </>
    )
}
// TODO
//  Forget Password screen
//  Remember me should save to session storage
//  Could Database workouts
//  Session storage text fields?
//  Login Error
//  Refresh Page Error

export function LoginMenu({ setAccount } : { setAccount: (v: AccountData | null) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const login = async () => {
        const data = await postRequest(Requests.SignIn, { username, password });
        if (data.result) {
            setAccount({ id: data.id, name: data.name, accessToken: data.accessToken });
            navigate(`/${Pages.HomePage}`);
        }
    }

    return (
        <div className={styles.background}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Login</h2>

                <div className={styles.inputGroup}>
                    <User className={styles.icon} size={18} />
                    <input type="text" placeholder="Username" className={styles.input} onChange={e => setUsername(e.target.value)} />
                </div>

                <div className={styles.inputGroup}>
                    <Lock className={styles.icon} size={18} />
                    <input type={showPassword ? "text" : "password"} placeholder="Password" className={styles.input} onChange={e => setPassword(e.target.value)} />
                    <div className={styles.eyeArea} onMouseEnter={() => setShowPassword(true)} onMouseLeave={() => setShowPassword(false)}>
                        {showPassword ? (<Eye className={styles.eyeIcon} size={18} />) : (<EyeOff className={styles.eyeIcon} size={18} />)}
                    </div>
                </div>

                <div className={styles.options}>
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#" onClick={() => getRequest(Requests.forgotPassword).then(data => console.log(data))} className={styles.forgot}>Forgot password?</a>
                </div>

                <button className={styles.loginButton} onClick={() => login()}>Login</button>

                <div className={styles.footer}>
                    Don't have an account?
                    <Link to={`../${Pages.RegisterPage}`}> Register</Link>
                </div>
            </div>
        </div>
    )
}

export function RegisterMenu({ setAccount } : { setAccount: (v: AccountData | null) => void }) {
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
    const navigate = useNavigate();

    const register = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const data = await postRequest(Requests.ValidateUsername, { username });

        if (!data.result) {
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
        postRequest(Requests.CreateAccount, { name, email, username, password }).then((response) => {
            if (response.result) {
                setAccount({ id: response.id, name: name, accessToken: response.token });
                navigate(`../../${Pages.HomePage}`)
            }
        })
    };

    const handleInput = (field: string, setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errorField === field) setErrorField("");
    };

    useEffect(() => {
        if (debouncedText) {
            if (username !== "" && !username.includes(" ")) {
                setCheckingUsername(true)
                postRequest(Requests.ValidateUsername, { username }).then(res => {
                    setValidUsername(res.result);
                    setErrorField("usernameTaken");
                }).finally(() => setCheckingUsername(false));
            } else {
                setCheckingUsername(false)
                setIsUsernameFocused(false);
            }
        }
    }, [debouncedText, username]);

    return (
        <div className={styles.background}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Register</h2>

                <div className={styles.inputGroup}>
                    <User className={styles.icon} size={18} />
                    <input
                        type="text"
                        placeholder="Full Name"
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
                {(validUsername && isUsernameFocused && !checkingUsername) && (
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
                    <input type="password" placeholder="Confirm Password" className={styles.input} onChange={handleInput("passwordConfirm", setPasswordConfirm)}/>
                </div>
                {errorField === "passwordConfirm" && (<p className={styles.errorText}>Please confirm your password.</p>)}
                {(passwordsMismatch || errorField === "passwordMismatch") && (<p className={styles.errorText}>⚠ Passwords do not match.</p>)}

                <button className={styles.loginButton} onClick={register}>Register</button>

                <div className={styles.footer}>
                    Already have an account?
                    <Link to={`../${Pages.LoginPage}`}> Login</Link>
                </div>
            </div>
        </div>
    );
}