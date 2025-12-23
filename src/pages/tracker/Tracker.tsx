import homeStyles from "../home/Home.module.css";
import {Home} from "lucide-react";
import {useNavigate} from "react-router-dom";

export type ExerciseDB = {
    name: string;
    force: string;
    level: string;
    mechanic: string;
    equipment: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    instructions: string[];
    category: string;
};

function Tracker() {
    const navigate = useNavigate();

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
        </div>
    )
}

export default Tracker