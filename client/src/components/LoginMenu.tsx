import {useState} from "react";
import styles from "../styles/AccountManager.module.css"
import {loginClient} from "../network/authRequests.ts";
import {Eye, EyeOff, Loader2, Lock, User} from "lucide-react";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {Pages} from "../utils/data.ts";

function LoginMenu({ setLoggedIn } : { setLoggedIn: (login: boolean) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const login = async () => {
        setLoggingIn(true);
        const res = await loginClient(username, password, rememberMe, setLoggedIn);
        setLoggingIn(false);
        setError(!res);
    }

    return (
        <div className={styles.background}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Login</h2>

                <div>
                    <div className={styles.inputGroup}>
                        <User className={styles.icon} size={18}/>
                        <input type="text" placeholder="Username" className={styles.input}
                               autoComplete="username"
                               onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <Lock className={styles.icon} size={18}/>
                        <input type={showPassword ? "text" : "password"} placeholder="Password" className={styles.input}
                               autoComplete="current-password"
                               onChange={e => setPassword(e.target.value)}
                        />
                        <div className={styles.eyeArea} onMouseEnter={() => setShowPassword(true)}
                             onMouseLeave={() => setShowPassword(false)}>
                            {showPassword ? (<Eye className={styles.eyeIcon} size={18}/>) : (
                                <EyeOff className={styles.eyeIcon} size={18}/>)}
                        </div>
                    </div>

                    {(error && !loggingIn) && (<div className={styles.loginError}>Incorrect Username or Password</div>)}

                    <div className={styles.options}>
                        <label>
                            <input type="checkbox" onChange={() => setRememberMe(!rememberMe)}/> Remember me
                        </label>
                        <Link to={`../${Pages.ForgotPage}`} className={styles.forgot}>Forgot password?</Link>
                    </div>

                    <motion.button whileTap={{scale: 0.85}} whileHover={{scale: 1.05}}
                                   transition={{type: "spring", stiffness: 300}}
                                   className={`${styles.loginButton} ${loggingIn ? styles.loggingIn : ""}`}
                                   onClick={login} disabled={loggingIn}
                    >
                        {loggingIn ? (
                            <>
                                <Loader2 className={styles.spinner} size={16}/>
                                Logging in...
                            </>
                        ) : ("Login")}
                    </motion.button>

                    <div className={styles.footer}>
                        Don't have an account?
                        <Link to={`../${Pages.RegisterPage}`}> Register</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginMenu;