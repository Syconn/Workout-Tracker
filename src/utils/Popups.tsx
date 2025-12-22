import styles from "./styles/poppup.module.css"
import {useOnlineStatus} from "./Util.tsx";
import {useState} from "react";

export function OfflinePopup() {
    const [ack, setAck] = useState("");
    const [acknowledged, setAcknowledged] = useState(false);
    const accepted = ack.toLowerCase() === "i understand";
    const isOffline = useOnlineStatus();

    if (!isOffline && !acknowledged) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.offline}>
                <h2 className={styles.gh}>
                    <span className={styles.cautionIcon}>⚠️</span>
                    Caution
                    <span className={styles.cautionIcon}>⚠️</span>
                </h2>

                <p className={styles.gp}>
                    You are currently offline. This affects how the app behaves.
                </p>

                <ul className={styles.list}>
                    <li>Workouts will be saved locally</li>
                    <li>Cloud sync is temporarily disabled</li>
                    <li>Progress may not appear on other devices</li>
                    <li>Data will sync automatically when online</li>
                    <li>Cloud data will not be pulled</li>
                </ul>

                <input
                    className={styles.input}
                    placeholder='Type "I understand" to continue'
                    value={ack}
                    onChange={(e) => setAck(e.target.value)}
                />

                <button
                    className={styles.button}
                    disabled={!accepted}
                    onClick={() => setAcknowledged(true)}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}