import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import homeStyles from "../styles/Home.module.css";
import styles from "../styles/Tracker.module.css";
import {Home} from "lucide-react";
import {ExerciseDB, NoWorkout, Pages, Superset, TrackedWorkout} from "../utils/data.ts";
import Fuse from "fuse.js";
import {capitalize} from "../utils/util.ts";

export function Track({workout, fuse, setWorkoutProp, setWorkout, saveWorkout}: {
    workout: TrackedWorkout,
    fuse: Fuse<ExerciseDB>,
    setWorkoutProp: <K extends keyof TrackedWorkout>(key: K, value: TrackedWorkout[K]) => void,
    setWorkout: (value: TrackedWorkout) => void,
    saveWorkout: () => void
}) {
    const [open, setOpen] = useState(false);
    const [innerOpen, setInnerOpen] = useState<[number, number, boolean]>([0, 0, false]);
    const [exercise, setExercise] = useState("");
    const [lift, setLift] = useState<number>(() => {
        const session = sessionStorage.getItem("lift")
        return session ? JSON.parse(session) : -1
    });
    const [pickExercise, pickedExercise] = useState(lift !== -1)
    const [adding, setAdding] = useState(lift !== -1)

    const navigate = useNavigate();
    const location = useLocation();
    const selectedExercise = location.state?.exercise ?? null;
    // const last = workout.lifts[lift] !== undefined && pastWorkout.lastLifted.has(workout.lifts[lift].exercise_id) ? pastWorkout.lastLifted.get(workout.lifts[lift].exercise_id) : undefined
    // const pr = workout.lifts[lift] !== undefined && pastWorkout.recordLift.has(workout.lifts[lift].exercise_id) ? pastWorkout.recordLift.get(workout.lifts[lift].exercise_id) : undefined
    // const prSet = pr !== undefined ? pastWorkout.workouts[pr[0]].lifts[pr[1]].set[pr[2]] : undefined
    const results = fuse.search(exercise).map(r => r.item);
    const innerResults = lift !== -1 ? fuse.search(workout.lifts[lift]?.set?.[innerOpen[0]]?.superset?.[innerOpen[1]]?.exercise_id ?? "").map(r => r.item) : [];

    const addLift = (exercise: string) => {
        const copy = structuredClone(workout.lifts);
        copy.push({exercise_id: exercise, set: [{weight: 0, reps: 0}]})
        setWorkoutProp("lifts", copy);
        setLift(copy.length - 1)
    }

    const remLift = (lift: number) => {
        const copy = structuredClone(workout.lifts).filter((_, i) => i !== lift);
        setWorkoutProp("lifts", copy);
    }

    const updateRep = (liftIndex: number, setIndex: number, field: "weight" | "reps", value: number) => {
        const copy = structuredClone(workout.lifts);
        if (value < 0) return;
        copy[liftIndex].set[setIndex][field] = value;
        setWorkoutProp("lifts", copy);
    };

    const addSet = (liftIndex: number) => {
        const copy = structuredClone(workout.lifts);
        const rep = copy[liftIndex]
        const weight = rep.set.length > 0 ? rep.set[rep.set.length - 1].weight : 0;
        rep.set.push({weight: weight, reps: 0, superset: []});
        setWorkoutProp("lifts", copy);
    };

    const remSet = (liftIndex: number, setIndex: number) => {
        const copy = structuredClone(workout.lifts);
        const rep = copy[liftIndex]

        rep.set = rep.set.filter((_, index) => index !== setIndex);
        setWorkoutProp("lifts", copy);
    };

    const updateSuperset = <K extends keyof Superset>(liftIndex: number, setIndex: number, supersetIndex: number, field: K, value: Superset[K]) => {
        const copy = structuredClone(workout.lifts);
        const rep = copy[liftIndex].set[setIndex];

        if (!rep.superset) rep.superset = []
        if (typeof value === "number" && value < 0) return;
        rep.superset[supersetIndex][field] = value
        setWorkoutProp("lifts", copy);
    };

    const addSuperset = (liftIndex: number, setIndex: number) => {
        const copy = structuredClone(workout.lifts);
        const rep = copy[liftIndex].set[setIndex];

        if (!rep.superset) rep.superset = [];
        const weight = rep.superset.length > 0 ? rep.superset[rep.superset.length - 1].weight : 0
        const liftId = rep.superset.length > 0 ? rep.superset[rep.superset.length - 1].exercise_id : copy[liftIndex].exercise_id
        rep.superset.push({weight: weight, reps: 0, exercise_id: liftId});
        setWorkoutProp("lifts", copy);
    };

    const remSuperset = (liftIndex: number, setIndex: number, ssIndex: number) => {
        const copy = structuredClone(workout.lifts);
        const rep = copy[liftIndex].set[setIndex];

        if (!rep.superset) return;
        rep.superset = rep.superset.filter((_, index) => index !== ssIndex);
        setWorkoutProp("lifts", copy);
    };

    useEffect(() => {
        if (selectedExercise != null) {
            setAdding(true)
            setExercise(selectedExercise)
        }
    }, [selectedExercise]);

    useEffect(() => {
        if (workout === NoWorkout) navigate(`${Pages.TrackerPage}/${Pages.StartPage}`)
    }, [navigate, workout]);

    useEffect(() => {
        sessionStorage.setItem("lift", JSON.stringify(lift));
    }, [lift]);

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
                    <h2 className={styles.heading}>{capitalize(workout.type)} Day</h2>

                    <div className={styles.innerCard}>
                        <button className={styles.trackButton} onClick={() => setAdding(!adding)} hidden={adding}>Add a
                            Lift
                        </button>

                        {adding && (
                            <div>
                                {!pickExercise && (
                                    <div className={styles.searchRow}>
                                        <button className={styles.iconButton}
                                                onClick={() => navigate(`${Pages.TrackerPage}/${Pages.SearchPage}`)}
                                                data-tooltip="Find Exercise">🔎
                                        </button>

                                        <div className={styles.autocomplete}>
                                            <input
                                                className={styles.selectorInput}
                                                placeholder="Enter Exercise"
                                                value={exercise}
                                                onChange={e => {
                                                    setExercise(e.target.value);
                                                    setOpen(true);
                                                }}
                                                onBlur={() => setTimeout(() => setOpen(false), 100)}
                                                onClick={() => setOpen(true)}
                                            />

                                            {open && exercise && (
                                                <ul className={styles.suggestions}>
                                                    {results.map((item, i) => (
                                                        <li
                                                            key={i}
                                                            onClick={() => {
                                                                setExercise(item.name);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <button className={styles.confirmButton} data-tooltip="Track Exercise"
                                                onClick={() => {
                                                    pickedExercise(true)
                                                    addLift(exercise)
                                                }}>✅
                                        </button>
                                    </div>
                                )}

                                {/* Modify Selected Workout */}
                                {pickExercise && (
                                    <div className={styles.setCard}>
                                        <h4>{workout.lifts[lift].exercise_id}</h4>

                                        {workout.lifts[lift] !== undefined && workout.lifts[lift].set.map((set, setIndex) => (
                                            <div key={setIndex}>
                                                <div className={styles.repRow}>
                                                    <div className={styles.repIndex}>
                                                        {setIndex + 1}
                                                    </div>

                                                    <div className={styles.field}>
                                                        <label className={styles.label}>
                                                            Weight:
                                                            <input
                                                                type="number"
                                                                className={styles.input}
                                                                value={Number(set.weight).toString()}
                                                                onChange={e => updateRep(lift, setIndex, "weight", +e.target.value)}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className={styles.field}>
                                                        <label className={styles.label}>
                                                            Reps:
                                                            <input
                                                                type="number"
                                                                className={styles.input}
                                                                value={Number(set.reps).toString()}
                                                                onChange={e => updateRep(lift, setIndex, "reps", +e.target.value)}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className={styles.supersetButtons}>
                                                        <button onClick={() => addSuperset(lift, setIndex)}
                                                                className={styles.addButton}>Add Superset
                                                        </button>
                                                        <button onClick={() => remSet(lift, setIndex)}
                                                                className={styles.remButton}>Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className={styles.supersetsRow}>
                                                    {set.superset?.map((ss, ssIndex) => (
                                                        <div key={ssIndex} className={styles.supersets}>
                                                            <div className={styles.autocomplete2}>
                                                                <input
                                                                    className={styles.selectorInput2}
                                                                    placeholder="Enter Exercise"
                                                                    value={ss.exercise_id}
                                                                    onChange={e => {
                                                                        updateSuperset(lift, setIndex, ssIndex, "exercise_id", e.target.value)
                                                                        setInnerOpen([setIndex, ssIndex, true])
                                                                    }}
                                                                    onBlur={() => setTimeout(() => {
                                                                        if (innerOpen[1] === ssIndex) setInnerOpen([setIndex, ssIndex, false])
                                                                    }, 100)}
                                                                    onClick={() => setInnerOpen([setIndex, ssIndex, true])}
                                                                />

                                                                {(innerOpen[0] === setIndex && innerOpen[1] === ssIndex && innerOpen[2] && ss.exercise_id) && (
                                                                    <ul className={styles.suggestions}>
                                                                        {innerResults.map((item, i) => (
                                                                            <li
                                                                                key={i}
                                                                                onClick={() => {
                                                                                    updateSuperset(lift, setIndex, ssIndex, "exercise_id", item.name)
                                                                                    setInnerOpen([setIndex, ssIndex, false])
                                                                                }}
                                                                            >
                                                                                {item.name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>

                                                            <div className={styles.field}>
                                                                <label className={styles.label}>
                                                                    Weight:
                                                                    <input
                                                                        type="number"
                                                                        className={styles.input}
                                                                        value={Number(ss.weight).toString()}
                                                                        onChange={e => updateSuperset(lift, setIndex, ssIndex, "weight", +e.target.value)}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className={styles.field}>
                                                                <label className={styles.label}>
                                                                    Reps:
                                                                    <input
                                                                        type="number"
                                                                        className={styles.input}
                                                                        value={Number(ss.reps).toString()}
                                                                        onChange={e => updateSuperset(lift, setIndex, ssIndex, "reps", +e.target.value)}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className={styles.supersetButtons2}>
                                                                <button
                                                                    onClick={() => remSuperset(lift, setIndex, ssIndex)}
                                                                    className={styles.remButton}>Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <div className={styles.supersetButtons2}>
                                            <button onClick={() => addSet(lift)} className={styles.addButton}>Add Set
                                            </button>
                                            <button onClick={() => {
                                                setLift(-1)
                                                setAdding(false)
                                                pickedExercise(false)
                                                setExercise("")
                                            }} className={styles.compButton}>Done
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/*{last !== undefined && (*/}
                    {/*    <div className={styles.innerCard}>*/}
                    {/*        <h2 className={styles.heading2}>Last Time</h2>*/}

                    {/*        <div className={styles.setCard2}>*/}
                    {/*            {pastWorkout.workouts[last[0]].lifts[last[1]].set.map(((set, setIndex) => (*/}
                    {/*                <div key={setIndex}>*/}
                    {/*                    <div className={styles.repRow}>*/}
                    {/*                        <label> Set {setIndex + 1} |</label>*/}

                    {/*                        <div className={styles.field}>*/}
                    {/*                            <label> Weight: {set.weight} </label>*/}
                    {/*                        </div>*/}

                    {/*                        <div className={styles.field}>*/}
                    {/*                            <label> Reps: {set.reps} </label>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}

                    {/*                    <div className={styles.supersetsRow}>*/}
                    {/*                        {set.superset?.map((ss, ssIndex) => (*/}
                    {/*                            <div key={ssIndex} className={styles.supersets}>*/}
                    {/*                                <div className={styles.field}>*/}
                    {/*                                    <label className={styles.label2}>*/}
                    {/*                                        Lift: {ss.exercise_id}*/}
                    {/*                                    </label>*/}
                    {/*                                </div>*/}

                    {/*                                <div className={styles.field}>*/}
                    {/*                                    <label className={styles.label2}>*/}
                    {/*                                        Weight: {ss.weight}*/}
                    {/*                                    </label>*/}
                    {/*                                </div>*/}

                    {/*                                <div className={styles.field}>*/}
                    {/*                                    <label className={styles.label2}>*/}
                    {/*                                        Reps: {ss.reps}*/}
                    {/*                                    </label>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        ))}*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            )))}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/*{pr !== undefined && prSet !== undefined && (*/}
                    {/*    <div className={styles.innerCard}>*/}
                    {/*        <h2 className={styles.heading2}>Personal Record</h2>*/}

                    {/*        <div className={styles.setCard2}>*/}
                    {/*            <div className={styles.repRow}>*/}
                    {/*                <div className={styles.field}>*/}
                    {/*                    <label> Weight: {prSet.weight} </label>*/}
                    {/*                </div>*/}

                    {/*                <div className={styles.field}>*/}
                    {/*                    <label> Reps: {prSet.reps} </label>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className={styles.supersetsRow}>*/}
                    {/*                {prSet.superset?.map((ss, ssIndex) => (*/}
                    {/*                    <div key={ssIndex} className={styles.supersets}>*/}
                    {/*                        <div className={styles.field}>*/}
                    {/*                            <label className={styles.label2}>*/}
                    {/*                                Lift: {ss.exercise_id}*/}
                    {/*                            </label>*/}
                    {/*                        </div>*/}

                    {/*                        <div className={styles.field}>*/}
                    {/*                            <label className={styles.label2}>*/}
                    {/*                                Weight: {ss.weight}*/}
                    {/*                            </label>*/}
                    {/*                        </div>*/}

                    {/*                        <div className={styles.field}>*/}
                    {/*                            <label className={styles.label2}>*/}
                    {/*                                Reps: {ss.reps}*/}
                    {/*                            </label>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                ))}*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* Recorded Workouts */}
                    {((workout.lifts.length > 0 && !adding) || (workout.lifts.length > 1)) && (
                        <div className={styles.innerCard}>
                            <h2 className={styles.heading2}>Recorded Lifts</h2>

                            {workout.lifts.map(((value, index) => (
                                index !== lift && (
                                    <div key={index} className={styles.setCard2}>
                                        <div className={styles.headerDone}>
                                            <h4>{value.exercise_id}</h4>
                                            <button onClick={() => {
                                                // console.log(pastWorkout.lastLifted)
                                                pickedExercise(true)
                                                setAdding(true)
                                                setLift(index)
                                            }} className={styles.compButtonRec}>Edit
                                            </button>
                                            <button onClick={() => remLift(index)}
                                                    className={styles.remButtonRec}>Remove
                                            </button>
                                        </div>

                                        {value.set.map((set, setIndex) => (
                                            <div key={setIndex}>
                                                <div className={styles.repRow}>
                                                    <label> Set {setIndex + 1} |</label>

                                                    <div className={styles.field}>
                                                        <label> Weight: {set.weight} </label>
                                                    </div>

                                                    <div className={styles.field}>
                                                        <label> Reps: {set.reps} </label>
                                                    </div>
                                                </div>

                                                <div className={styles.supersetsRow}>
                                                    {set.superset?.map((ss, ssIndex) => (
                                                        <div key={ssIndex} className={styles.supersets}>
                                                            <div className={styles.field}>
                                                                <label className={styles.label2}>
                                                                    Lift: {ss.exercise_id}
                                                                </label>
                                                            </div>

                                                            <div className={styles.field}>
                                                                <label className={styles.label2}>
                                                                    Weight: {ss.weight}
                                                                </label>
                                                            </div>

                                                            <div className={styles.field}>
                                                                <label className={styles.label2}>
                                                                    Reps: {ss.reps}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )))}
                        </div>
                    )}

                    <div className={styles.controlButtons}>
                        <button className={styles.completeButton} onClick={() => {
                            saveWorkout()
                            navigate("/")
                        }}>Completed Lift
                        </button>

                        <button className={styles.removeButton2} onClick={() => {
                            localStorage.removeItem("trackedWorkout")
                            sessionStorage.removeItem("lift")
                            setWorkout(NoWorkout)
                            navigate("/")
                        }}>Cancel Lift
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}