// export function ForgetPasswordMenu() { TODO IDK WHAT I AM GOING TO DO WITH THIS
//     const [sentConfirmation, setSentConfirmation] = useState<boolean>(false);
//     const [validUsername, setValidUsername] = useState<boolean>(true);
//     const [email, setEmail] = useState<string>("");
//     const [validCode, setValidCode] = useState<boolean>(true);
//     const [showPassword, setShowPassword] = useState(false);
//     const [securityCode, setSecurityCode] = useState("");
//     const [password, setPassword] = useState("");
//     const [passwordConfirm, setPasswordConfirm] = useState("");
//
//     const navigate = useNavigate();
//     const passwordsMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
//
//     const handle = async () => {
//         // if (!sentConfirmation) {
//         //     if ((await postRequest(Requests.ForgotPassword, { email })).result == "success") setSentConfirmation(true);
//         //     else setValidUsername(false);
//         // } else if (!passwordsMismatch) {
//         //     if ((await postRequest(Requests.ResetPassword, { email, securityCode, password })).result !== "success") setValidCode(false);
//         //     else navigate(`../${Pages.LoginPage}`)
//         // }
//     }
//
//     return (
//         <div className={styles.background}>
//             <div className={styles.loginBox}>
//                 <h2 className={styles.title}>Reset Password</h2>
//
//                 {sentConfirmation && (
//                     <div>
//                         <div className={styles.inputGroup}>
//                             <KeyRound className={styles.icon} size={18} />
//                             <input type="text" placeholder="Code" className={styles.input}
//                                    onChange={v => setSecurityCode(v.target.value)}
//                             />
//                         </div>
//
//                         <div className={styles.inputGroup}>
//                             <Lock className={styles.icon} size={18} />
//                             <input type={showPassword ? "text" : "password"} placeholder="Password" className={styles.input}
//                                    onChange={v => setPassword(v.target.value)}
//                             />
//                             <div className={styles.eyeArea} onMouseEnter={() => setShowPassword(true)}
//                                  onMouseLeave={() => setShowPassword(false)}
//                             >
//                                 {showPassword ? (<Eye className={styles.eyeIcon} size={18} />) : (<EyeOff className={styles.eyeIcon} size={18} />)}
//                             </div>
//                         </div>
//
//                         <div className={styles.inputGroup}>
//                             <Lock className={styles.icon} size={18} />
//                             <input type="password" placeholder="Confirm Password" className={styles.input}
//                                    onChange={v => setPasswordConfirm(v.target.value)} />
//                         </div>
//
//                         {passwordsMismatch && (<p className={styles.errorText}>⚠ Passwords do not match.</p>)}
//                     </div>
//                 )}
//
//                 {!sentConfirmation && (
//                     <div>
//                         <div className={styles.inputGroup}>
//                             <Mail className={styles.icon} size={18} />
//                             <input type="email" placeholder="Email" className={styles.input}
//                                    onChange={v => setEmail(v.target.value)}
//                             />
//                         </div>
//
//                         {!validUsername && (<div className={styles.loginError}>No account connected to this email </div>)}
//                     </div>
//                 )}
//
//                 {!validCode && (<p className={styles.loginError}>⚠ This is not the proper security code</p>)}
//
//                 <motion.button whileTap={{ scale: 0.85}} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}
//                                className={styles.loginButton} onClick={handle}
//                 >
//                     {!sentConfirmation ? "Confirm Email" : "Reset Password"}
//                 </motion.button>
//
//                 <motion.button whileTap={{ scale: 0.85}} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}
//                                className={styles.loginButton} onClick={() => navigate(`../${Pages.LoginPage}`)}
//                 >
//                     Cancel
//                 </motion.button>
//             </div>
//         </div>
//     )
// }