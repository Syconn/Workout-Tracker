import styles from "./styles/poppup.module.css"
import {useOnlineStatus} from "./Util.tsx";

export function OfflinePopup() {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.offline}>
                <h2 className={styles.gh}>Caution</h2>
                <p className={styles.gp}>
                    You are offline. Progress will be saved locally.
                </p>
            </div>
        </div>
    )
}