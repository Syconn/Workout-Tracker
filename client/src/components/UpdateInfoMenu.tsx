import {ModifyUserData} from "../network/networkData.ts";
import styles from "../styles/Profile.module.css";
import {ChangeEvent} from "react";

function UpdateInfoMenu({form, handleChange, updateForm, toggleMode}: { form: ModifyUserData, handleChange: (e: ChangeEvent<HTMLInputElement>) => void, updateForm: () => void, toggleMode: () => void }) {
    return (
        <div>
            <h2 className={styles.heading}>Account Information</h2>

            <div className={styles.field}> {/* TODO How do i change username */}
                <label>Username</label>
                <input name="username" value={form.username} disabled tabIndex={-1} aria-disabled={true} style={{cursor: "auto", color: "#b9b9b9"}}/>
            </div>

            <div className={styles.field}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}/>
            </div>

            <div style={{display: "flex", gap: "12px", height: "80px"}}>
                <button className={styles.saveButton} onClick={toggleMode} style={{backgroundColor: "#2563eb"}}>Change Password</button>
                <button className={styles.saveButton} onClick={updateForm}>Save Changes</button>
            </div>
        </div>
    )
}

export default UpdateInfoMenu;