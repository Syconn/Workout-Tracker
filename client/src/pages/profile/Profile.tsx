import {AccountData} from "../accounts/AccountManager.tsx";
import homeStyles from "../home/Home.module.css"
import styles from "./Profile.module.css"
import {useNavigate} from "react-router-dom";
import {logout} from "../../utils/Util.tsx";
import {Eye, EyeOff, Home} from "lucide-react";
import React, {useEffect, useState} from "react";
import {postRequest} from "../../networking/WebRequests.tsx";
import {NoAccount, Pages, Requests} from "../../utils/Constants.ts";

type Profile = {
    name: string,
    email: string;
    username: string;
    password: string;
}

type SaveStatus = "success" | "error" | null;

export function Profile({ account, setAccount }: { account: AccountData, setAccount: (account: AccountData) => void }) {
    const [form, setForm] = useState<Profile>({ name: "", email: "", username: "", password: "" });
    const [originalForm, setOriginalForm] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
    const [statusMessage, setStatusMessage] = useState("");
    const navigate = useNavigate();
    const isFormChanged = originalForm ? JSON.stringify(form) === JSON.stringify(originalForm) : false;

    useEffect(() => {
        if (account === NoAccount) navigate(`${Pages.AccountManager}`)

        let cancelled = false;
        setLoading(true);

        postRequest(Requests.Form, { id: account.id, authToken: account.accessToken }).then(v => {
            if (!cancelled) {
                setForm(v);
                setOriginalForm(v);
                setLoading(false);
            }
        }).catch(() => {
            if (!cancelled) setLoading(false);
        });

        return () => {
            cancelled = true;
            }
    }, [account, navigate]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function updateForm() {
        if (isFormChanged) return;

        try {
            const res = await postRequest(Requests.ModifyForm, { id: account.id, authToken: account.accessToken, ...form });

            console.log(res);

            if (res?.result) {
                setSaveStatus("success");
                setStatusMessage("Profile updated successfully.");
            } else {
                setSaveStatus("error");
                setStatusMessage("Failed to update profile.");
            }
        } catch (e) {
            console.error(e);
            setSaveStatus("error");
            setStatusMessage("Server error. Please try again.");
        }

        setTimeout(() => {
            setSaveStatus(null);
            setStatusMessage("");
        }, 3000);
    }

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo} />
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Profile</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2} />
                    </button>
                </div>
            </header>

            {saveStatus && (
                <div className={`${styles.statusBar} ${saveStatus === "success" ? styles.success : styles.error}`}>
                    {statusMessage}
                </div>
            )}

            <main className={styles.profileContainer}>
                <div className={styles.card}>
                    {loading ? (
                        <div className={styles.loadingWrapper}>
                            <div className={styles.spinner} />
                            <p className={styles.loadingText}>Loading profile…</p>
                        </div>
                    ) : (
                        <>
                            <h2 className={styles.heading}>Account Information</h2>

                            <div className={styles.field}>
                                <label>Name</label>
                                <input name="name" value={form.name} onChange={handleChange} />
                            </div>

                            <div className={styles.field}>
                                <label>Email</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} />
                            </div>

                            <div className={styles.field}>
                                <label>Username</label>
                                <input name="username" value={form.username} onChange={handleChange} />
                            </div>

                            <div className={styles.field}>
                                <label>Password</label>

                                <div className={styles.inputWrapper}>
                                    <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange}/>

                                    <div className={styles.eyeArea} onMouseEnter={() => setShowPassword(true)} onMouseLeave={() => setShowPassword(false)}>
                                        {showPassword ? (
                                            <Eye className={styles.eyeIcon} size={18} />
                                        ) : (
                                            <EyeOff className={styles.eyeIcon} size={18} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button className={styles.saveButton} onClick={() => updateForm()}>Save Changes</button>

                            <button className={styles.logoutButton} onClick={() => logout(setAccount, true)}>
                                Log Out
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}