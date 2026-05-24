import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {NoWorkout, Pages, TrackedWorkout} from "../utils/data.ts";
import homeStyles from "../styles/Home.module.css";
import styles from "../styles/Tracker.module.css";
import {Home} from "lucide-react";
import {capitalize} from "../utils/util.ts";

export function TrackerStart({workout, setWorkoutProp}: { workout: TrackedWorkout, setWorkoutProp: <K extends keyof TrackedWorkout>(key: K, value: TrackedWorkout[K]) => void }) {
    const [type, setType] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const navigate = useNavigate();

    const track = () => {
        setWorkoutProp("type", type)
        setWorkoutProp("lifts", [])
        setWorkoutProp("date", new Date())
        navigate(Pages.TrackPage)
    }

    useEffect(() => {
        if (workout !== NoWorkout) navigate(`${Pages.TrackerPage}/${Pages.TrackPage}`)
    }, [navigate, workout]);

    return (
        <div className={homeStyles.page}>
            <header className={homeStyles.appHeader}>
                <div className={homeStyles.headerLeft}>
                    <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo}/>
                </div>

                <div className={homeStyles.headerCenter}>
                    <h1 className={homeStyles.title}>Tracker</h1>
                </div>

                <div className={homeStyles.headerRight}>
                    <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
                        <Home size={20} color="#f5f5f5" strokeWidth={2}/>
                    </button>
                </div>
            </header>

            <main className={styles.profileContainer}>
                <div className={styles.selectorCard}>
                    <span className={styles.selectorLabel}>Workout Type</span>

                    <div className={styles.fakeSelect}>
                        <button onClick={() => setOpen(v => !v)}>{capitalize(type) || "Select a workout"}</button>

                        {open && (
                            <ul className={styles.menu}>
                                {["push", "pull", "legs", "upper", "lower"].map(v => (
                                    <li
                                        key={v}
                                        onClick={() => {
                                            setType(v);
                                            setOpen(false);
                                        }}
                                    >
                                        {capitalize(v)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button className={styles.trackButton} disabled={type === ""} onClick={track}>Track Workout</button>
                </div>
            </main>
        </div>
    )
}