import styles from "../styles/Profile.module.css";
import homeStyles from "../styles/Home.module.css";
import {Pages} from "../utils/data.ts";
import {Home} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {changePasswordClient, logoutClient} from "../network/authRequests.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {ModifyUserData, UNLOADED_MODIFY_USER} from "../network/networkData.ts";
import {updateInfo, userInfo} from "../network/userRequests.ts";
import UpdateInfoMenu from "../components/UpdateInfoMenu.tsx";
import ChangePasswordMenu from "../components/ChangePasswordMenu.tsx";

export function Profile({ setLoggedIn }: { setLoggedIn: (val: boolean) => void }) {
    const [form, setForm] = useState<ModifyUserData>(UNLOADED_MODIFY_USER);
    const [originalForm, setOriginalForm] = useState<ModifyUserData>(UNLOADED_MODIFY_USER);
    const [mode, setMode] = useState<"modifyInfo" | "resetPassword">("modifyInfo");
    const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
    const [statusMessage, setStatusMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadForm = async () => {
            const res = {...UNLOADED_MODIFY_USER, ...await userInfo()}
            setForm(res);
            setOriginalForm(res);
        }
        void loadForm();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    }

    const updateForm = async () => {
        if (form === originalForm) return;

        const res = await updateInfo(form.name, form.email)
        if (res) {
            setSaveStatus("success");
            setStatusMessage("Profile updated successfully.");
            setOriginalForm(form)
        } else {
            setSaveStatus("error");
            setStatusMessage("Failed to update profile.");
            setForm(originalForm)
        }

        setTimeout(() => {
            setSaveStatus(null);
            setStatusMessage("");
        }, 1500);
    }

    const changePassword = async () => {
        const res = await changePasswordClient(form)

        if (res === true) {
            setSaveStatus("success");
            setStatusMessage("Password changed successfully.");
            setForm(originalForm)
        } else {
            setSaveStatus("error");
            setStatusMessage(res);
        }

        setTimeout(() => {
            setSaveStatus(null);
            setStatusMessage("");
        }, 1500);
    }

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo}/>
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Profile</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate(Pages.Home)} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2}/>
                    </button>
                </div>
            </header>

            {saveStatus !== null && (
                <div className={`${styles.statusBar} ${saveStatus === "success" ? styles.success : styles.error}`}>
                    {statusMessage}
                </div>
            )}

            <main className={styles.profileContainer}>
                <div className={styles.card}>

                    {form === UNLOADED_MODIFY_USER ? (
                        <div className={styles.loadingWrapper}>
                            <div className={styles.spinner}/>
                            <p className={styles.loadingText}>Loading profile…</p>
                        </div>
                    ) : (
                        <div>
                            {mode === "modifyInfo" && <UpdateInfoMenu form={form} handleChange={handleChange} updateForm={() => void updateForm()} toggleMode={() => setMode("resetPassword")} />}
                            {mode === "resetPassword" && <ChangePasswordMenu form={form} handleChange={handleChange} updateForm={() => void changePassword()} toggleMode={() => setMode("modifyInfo")} />}
                        </div>
                    )}

                    <button className={styles.logoutButton} onClick={() => void logoutClient(setLoggedIn)}>
                        Log Out
                    </button>
                </div>
            </main>
        </div>
    )
}