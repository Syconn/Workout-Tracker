import {AccountData} from "../accounts/AccountManager.tsx";
import homeStyles from "../home/Home.module.css"
import styles from "./Profile.module.css"
import {useNavigate} from "react-router-dom";
import {logout} from "../../utils/Util.tsx";
import {Home} from "lucide-react";

export function Profile({ account, setAccount }: { account: AccountData, setAccount: (account: AccountData) => void }) {
    const navigate = useNavigate();

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img
                        src="icon.png"
                        alt="Workout Tracker Logo"
                        className={homeStyles.logo}
                    />
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

            <main className={styles.profileContainer}>
                <div className={styles.card}>
                    <h2 className={styles.heading}>
                        Account Information
                    </h2>

                    <div className={styles.field}>
                        <label>Name</label>
                        <input
                            name="name"
                            value={account.name}
                            // onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            // value={account.email}
                            // onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Username</label>
                        <input
                            name="username"
                            // value={account.username}
                            // onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            // value={account.password}
                            // onChange={handleChange}
                        />
                    </div>

                    <button className={styles.saveButton}>
                        Save Changes
                    </button>

                    <button className={styles.logoutButton} onClick={() => logout(setAccount)}>
                        Log Out
                    </button>
                </div>
            </main>
        </div>
    );
}