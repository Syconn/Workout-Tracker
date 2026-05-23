import styles from "../styles/Profile.module.css";
import {ModifyUserData} from "../network/networkData.ts";
import {ChangeEvent, useState} from "react";
import {Eye, EyeOff} from "lucide-react";

function ChangePasswordMenu({ form, handleChange, updateForm, toggleMode }: { form: ModifyUserData, handleChange: (e: ChangeEvent<HTMLInputElement>) => void, updateForm: () => void, toggleMode: () => void }) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const changePassword = () => {
        if (form.oldPassword === form.newPassword) return
        if (form.newPassword !== form.confirmPassword) return
        if (!form.newPassword.trim().length) return;
        updateForm();
    }

    return (
        <div>
            <h2 className={styles.heading}>Account Information</h2>

            <div className={styles.field}> {/* TODO How do i do that */}
                <label>Username</label>
                <input name="username" value={form.username} disabled tabIndex={-1} aria-disabled={true} style={{cursor: "auto", color: "#b9b9b9"}}/>
            </div>

            <div className={styles.field}>
                <label>Old Password</label>

                <div className={styles.inputWrapper}>
                    <input name="oldPassword" type={showOldPassword ? "text" : "password"} value={form.oldPassword} onChange={handleChange}/>

                    <div className={styles.eyeArea} onMouseEnter={() => setShowOldPassword(true)} onMouseLeave={() => setShowOldPassword(false)}>
                        {showOldPassword ? (<Eye className={styles.eyeIcon} size={18} />) : (<EyeOff className={styles.eyeIcon} size={18} />)}
                    </div>
                </div>
            </div>

            <div className={styles.field}>
                <label>New Password</label>

                <div className={styles.inputWrapper}>
                    <input name="newPassword" type={showNewPassword ? "text" : "password"} value={form.newPassword} onChange={handleChange}/>

                    <div className={styles.eyeArea} onMouseEnter={() => setShowNewPassword(true)} onMouseLeave={() => setShowNewPassword(false)}>
                        {showNewPassword ? (<Eye className={styles.eyeIcon} size={18} />) : (<EyeOff className={styles.eyeIcon} size={18} />)}
                    </div>
                    {form.oldPassword && form.newPassword && form.oldPassword === form.newPassword && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>Same as old password</div>}
                </div>
            </div>

            <div className={styles.field}>
                <label>Confirm Password</label>
                <input name="confirmPassword" type={"password"} value={form.confirmPassword} onChange={handleChange} onPaste={e => e.preventDefault()}/>
                {form.confirmPassword && form.confirmPassword !== form.newPassword && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>Passwords do not match</div>}
            </div>

            <div style={{display: "flex", gap: "12px", height: "80px"}}>
                <button className={styles.saveButton} onClick={toggleMode} style={{backgroundColor: "#2563eb"}}>Change Information</button>
                <button className={styles.saveButton} onClick={changePassword}>Change Password</button>
            </div>
        </div>
    )
}

export default ChangePasswordMenu;