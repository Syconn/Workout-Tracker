import {AccountData} from "../accounts/AccountManager.tsx";
import styles from "./Home.module.css";
import {NoAccount, Pages} from "../../utils/Constants.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {User} from "lucide-react";

function HomeMenu({ account }: { account: AccountData }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (account === NoAccount) navigate(`${Pages.AccountManager}`)
    }, [navigate, account]);

    return (
        <div className={styles.page}>
            <header className={styles.appHeader}>
                <div className={styles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={styles.logo}/>
                </div>

                <div className={styles.headerCenter}>
                    <h1 className={styles.title}>Workout Tracker</h1>
                </div>

                <div className={styles.headerRight}>
                    <button onClick={() => navigate(Pages.ProfilePage)} className={styles.accountIcon}>
                        <User size={20} color="#f5f5f5" strokeWidth={2} />
                    </button>
                </div>
            </header>

            <main className={styles.homeContainer}>
                <section className={styles.homeHeader}>
                    <h2>
                        Welcome back,{" "}
                        <span className={styles.userName}>{account.name} </span> 💪
                    </h2>
                    <p>Ready to crush today’s workout?</p>
                </section>

                <section className={styles.homeActions}>
                    <button onClick={() => navigate(Pages.TrackerPage)} className={`${styles.homeButton} ${styles.primary}`}>
                        Start Workout
                    </button>

                    <button className={styles.homeButton}>
                        Workout History
                    </button>

                    <button className={styles.homeButton}>
                        Check Progress
                    </button>
                </section>
            </main>
        </div>
    );
}

export default HomeMenu;