// import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
// import {capitalize, getExerciseImage} from "../../utils/Util.tsx";
// import {NavigateFunction, Outlet, useLocation, useNavigate} from "react-router-dom";
// import {MuscleGroups, Muscles, NoAccount, NoWorkout, Pages} from "../../utils/Constants.ts";
// import {AccountData} from "../accounts/AccountManager.tsx";
// import {List, RowComponentProps} from 'react-window';
// import homeStyles from "../home/Home.module.css";
// import styles from "./Tracker.module.css";
// import exerciseDB from "../../data/exercises.json"
// import exerciseNames from "../../data/exercise_names.json"
// import {Home} from "lucide-react";
// import {createFuse} from "../../utils/fuse.ts";
// import Fuse from "fuse.js";
//
// export type ExerciseDB = {
//     name: string;
//     force: string;
//     level: string;
//     mechanic: string;
//     equipment: string;
//     primaryMuscles: string[];
//     secondaryMuscles: string[];
//     instructions: string[];
//     category: string;
//     images: string[];
// };
//
// export type Workouts = {
//     workouts: TrackedWorkout[]
//     lastLifted: Map<string, [number, number]> // Prevent needing to save two copies
//     recordLift: Map<string, [number, number, number]>
// }
//
// export type TrackedWorkout = {
//     type: string;
//     date: Date | string;
//     workout_length_minutes: number;
//     lifts: Lift[]
// }
//
// export type Lift = {
//     exercise_id: string;
//     set: Set[];
// }
//
// export type Set = {
//     weight: number;
//     reps: number;
//     superset?: Superset[]
// }
//
// export type Superset = {
//     exercise_id: string;
//     weight: number;
//     reps: number;
// }
//
// export type SetWorkoutProps = {
//     setWorkoutProp: <K extends keyof TrackedWorkout>(key: K, value: TrackedWorkout[K]) => void
//     setWorkout: (value: TrackedWorkout) => void
//     saveWorkout: () => void
// }
//
// export function TrackerStart({workout, setWorkoutProp}: { workout: TrackedWorkout } & SetWorkoutProps) {
//     const [type, setType] = useState<string>("")
//     const [open, setOpen] = useState<boolean>(false)
//     const navigate = useNavigate();
//
//     const track = () => {
//         setWorkoutProp("type", type)
//         setWorkoutProp("lifts", [])
//         setWorkoutProp("date", new Date())
//         navigate(Pages.TrackPage)
//     }
//
//     useEffect(() => {
//         if (workout !== NoWorkout) navigate(`${Pages.TrackerPage}/${Pages.TrackPage}`)
//     }, [navigate, workout]);
//
//     return (
//         <div className={homeStyles.page}>
//             <header className={homeStyles.appHeader}>
//                 <div className={homeStyles.headerLeft}>
//                     <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo}/>
//                 </div>
//
//                 <div className={homeStyles.headerCenter}>
//                     <h1 className={homeStyles.title}>Tracker</h1>
//                 </div>
//
//                 <div className={homeStyles.headerRight}>
//                     <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
//                         <Home size={20} color="#f5f5f5" strokeWidth={2}/>
//                     </button>
//                 </div>
//             </header>
//
//             <main className={styles.profileContainer}>
//                 <div className={styles.selectorCard}>
//                     <span className={styles.selectorLabel}>Workout Type</span>
//
//                     <div className={styles.fakeSelect}>
//                         <button onClick={() => setOpen(v => !v)}>{capitalize(type) || "Select a workout"}</button>
//
//                         {open && (
//                             <ul className={styles.menu}>
//                                 {["push", "pull", "legs", "upper", "lower"].map(v => (
//                                     <li
//                                         key={v}
//                                         onClick={() => {
//                                             setType(v);
//                                             setOpen(false);
//                                         }}
//                                     >
//                                         {capitalize(v)}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//
//                     <button className={styles.trackButton} disabled={type === ""} onClick={track}>Track Workout</button>
//                 </div>
//             </main>
//         </div>
//     )
// }
//
// export function Track({workout, pastWorkout, setWorkoutProp, setWorkout, saveWorkout}: {
//     workout: TrackedWorkout,
//     pastWorkout: Workouts
// } & SetWorkoutProps) {
//     const [open, setOpen] = useState(false);
//     const [innerOpen, setInnerOpen] = useState<[number, number, boolean]>([0, 0, false]);
//     const [exercise, setExercise] = useState("");
//     const [lift, setLift] = useState<number>(() => {
//         const session = sessionStorage.getItem("lift")
//         return session ? JSON.parse(session) : -1
//     });
//     const [pickExercise, pickedExercise] = useState(lift !== -1)
//     const [adding, setAdding] = useState(lift !== -1)
//
//     const navigate = useNavigate();
//     const location = useLocation();
//     const selectedExercise = location.state?.exercise ?? null;
//     const last = workout.lifts[lift] !== undefined && pastWorkout.lastLifted.has(workout.lifts[lift].exercise_id) ? pastWorkout.lastLifted.get(workout.lifts[lift].exercise_id) : undefined
//     const pr = workout.lifts[lift] !== undefined && pastWorkout.recordLift.has(workout.lifts[lift].exercise_id) ? pastWorkout.recordLift.get(workout.lifts[lift].exercise_id) : undefined
//     const prSet = pr !== undefined ? pastWorkout.workouts[pr[0]].lifts[pr[1]].set[pr[2]] : undefined
//
//     const fuse = new Fuse(exerciseNames, {
//         threshold: 0.15,
//         shouldSort: true,
//     });
//
//     const results = fuse.search(exercise).map(r => r.item);
//     const innerResults = lift !== -1 ? fuse.search(workout.lifts[lift]?.set?.[innerOpen[0]]?.superset?.[innerOpen[1]]?.exercise_id ?? "").map(r => r.item) : [];
//
//     const addLift = (exercise: string) => {
//         const copy = structuredClone(workout.lifts);
//         copy.push({exercise_id: exercise, set: [{weight: 0, reps: 0}]})
//         setWorkoutProp("lifts", copy);
//         setLift(copy.length - 1)
//     }
//
//     const remLift = (lift: number) => {
//         const copy = structuredClone(workout.lifts).filter((_, i) => i !== lift);
//         setWorkoutProp("lifts", copy);
//     }
//
//     const updateRep = (liftIndex: number, setIndex: number, field: "weight" | "reps", value: number) => {
//         const copy = structuredClone(workout.lifts);
//
//         if (value < 0) return;
//         copy[liftIndex].set[setIndex][field] = value;
//         setWorkoutProp("lifts", copy);
//     };
//
//     const addSet = (liftIndex: number) => {
//         const copy = structuredClone(workout.lifts);
//         const rep = copy[liftIndex]
//
//         const weight = rep.set.length > 0 ? rep.set[rep.set.length - 1].weight : 0;
//         rep.set.push({weight: weight, reps: 0, superset: []});
//         setWorkoutProp("lifts", copy);
//     };
//
//     const remSet = (liftIndex: number, setIndex: number) => {
//         const copy = structuredClone(workout.lifts);
//         const rep = copy[liftIndex]
//
//         rep.set = rep.set.filter((_, index) => index !== setIndex);
//         setWorkoutProp("lifts", copy);
//     };
//
//     const updateSuperset = <K extends keyof Superset>(liftIndex: number, setIndex: number, supersetIndex: number, field: K, value: Superset[K]) => {
//         const copy = structuredClone(workout.lifts);
//         const rep = copy[liftIndex].set[setIndex];
//
//         if (!rep.superset) rep.superset = []
//         if (typeof value === "number" && value < 0) return;
//         rep.superset[supersetIndex][field] = value
//         setWorkoutProp("lifts", copy);
//     };
//
//     const addSuperset = (liftIndex: number, setIndex: number) => {
//         const copy = structuredClone(workout.lifts);
//         const rep = copy[liftIndex].set[setIndex];
//
//         if (!rep.superset) rep.superset = [];
//         const weight = rep.superset.length > 0 ? rep.superset[rep.superset.length - 1].weight : 0
//         const liftId = rep.superset.length > 0 ? rep.superset[rep.superset.length - 1].exercise_id : copy[liftIndex].exercise_id
//         rep.superset.push({weight: weight, reps: 0, exercise_id: liftId});
//         setWorkoutProp("lifts", copy);
//     };
//
//     const remSuperset = (liftIndex: number, setIndex: number, ssIndex: number) => {
//         const copy = structuredClone(workout.lifts);
//         const rep = copy[liftIndex].set[setIndex];
//
//         if (!rep.superset) return;
//         rep.superset = rep.superset.filter((_, index) => index !== ssIndex);
//         setWorkoutProp("lifts", copy);
//     };
//
//     useEffect(() => {
//         if (selectedExercise != null) {
//             setAdding(true)
//             setExercise(selectedExercise)
//         }
//     }, [selectedExercise]);
//
//     useEffect(() => {
//         if (workout === NoWorkout) navigate(`${Pages.TrackerPage}/${Pages.StartPage}`)
//     }, [navigate, workout]);
//
//     useEffect(() => {
//         sessionStorage.setItem("lift", JSON.stringify(lift));
//     }, [lift]);
//
//     return (
//         <div className={homeStyles.page}>
//             <header className={homeStyles.appHeader}>
//                 <div className={homeStyles.headerLeft}>
//                     <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo}/>
//                 </div>
//
//                 <div className={homeStyles.headerCenter}>
//                     <h1 className={homeStyles.title}>Tracker</h1>
//                 </div>
//
//                 <div className={homeStyles.headerRight}>
//                     <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
//                         <Home size={20} color="#f5f5f5" strokeWidth={2}/>
//                     </button>
//                 </div>
//             </header>
//
//             <main className={styles.profileContainer}>
//                 <div className={styles.selectorCard}>
//                     <h2 className={styles.heading}>{capitalize(workout.type)} Day</h2>
//
//                     <div className={styles.innerCard}>
//                         <button className={styles.trackButton} onClick={() => setAdding(!adding)} hidden={adding}>Add a
//                             Lift
//                         </button>
//
//                         {adding && (
//                             <div>
//                                 {!pickExercise && (
//                                     <div className={styles.searchRow}>
//                                         <button className={styles.iconButton}
//                                                 onClick={() => navigate(`${Pages.TrackerPage}/${Pages.SearchPage}`)}
//                                                 data-tooltip="Find Exercise">🔎
//                                         </button>
//
//                                         <div className={styles.autocomplete}>
//                                             <input
//                                                 className={styles.selectorInput}
//                                                 placeholder="Enter Exercise"
//                                                 value={exercise}
//                                                 onChange={e => {
//                                                     setExercise(e.target.value);
//                                                     setOpen(true);
//                                                 }}
//                                                 onBlur={() => setTimeout(() => setOpen(false), 100)}
//                                                 onClick={() => setOpen(true)}
//                                             />
//
//                                             {open && exercise && (
//                                                 <ul className={styles.suggestions}>
//                                                     {results.map((item, i) => (
//                                                         <li
//                                                             key={i}
//                                                             onClick={() => {
//                                                                 setExercise(item);
//                                                                 setOpen(false);
//                                                             }}
//                                                         >
//                                                             {item}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             )}
//                                         </div>
//
//                                         <button className={styles.confirmButton} data-tooltip="Track Exercise"
//                                                 onClick={() => {
//                                                     pickedExercise(true)
//                                                     addLift(exercise)
//                                                 }}>✅
//                                         </button>
//                                     </div>
//                                 )}
//
//                                 {/* Modify Selected Workout */}
//                                 {pickExercise && (
//                                     <div className={styles.setCard}>
//                                         <h4>{workout.lifts[lift].exercise_id}</h4>
//
//                                         {workout.lifts[lift] !== undefined && workout.lifts[lift].set.map((set, setIndex) => (
//                                             <div key={setIndex}>
//                                                 <div className={styles.repRow}>
//                                                     <div className={styles.repIndex}>
//                                                         {setIndex + 1}
//                                                     </div>
//
//                                                     <div className={styles.field}>
//                                                         <label className={styles.label}>
//                                                             Weight:
//                                                             <input
//                                                                 type="number"
//                                                                 className={styles.input}
//                                                                 value={Number(set.weight).toString()}
//                                                                 onChange={e => updateRep(lift, setIndex, "weight", +e.target.value)}
//                                                             />
//                                                         </label>
//                                                     </div>
//
//                                                     <div className={styles.field}>
//                                                         <label className={styles.label}>
//                                                             Reps:
//                                                             <input
//                                                                 type="number"
//                                                                 className={styles.input}
//                                                                 value={Number(set.reps).toString()}
//                                                                 onChange={e => updateRep(lift, setIndex, "reps", +e.target.value)}
//                                                             />
//                                                         </label>
//                                                     </div>
//
//                                                     <div className={styles.supersetButtons}>
//                                                         <button onClick={() => addSuperset(lift, setIndex)}
//                                                                 className={styles.addButton}>Add Superset
//                                                         </button>
//                                                         <button onClick={() => remSet(lift, setIndex)}
//                                                                 className={styles.remButton}>Remove
//                                                         </button>
//                                                     </div>
//                                                 </div>
//
//                                                 <div className={styles.supersetsRow}>
//                                                     {set.superset?.map((ss, ssIndex) => (
//                                                         <div key={ssIndex} className={styles.supersets}>
//                                                             <div className={styles.autocomplete2}>
//                                                                 <input
//                                                                     className={styles.selectorInput2}
//                                                                     placeholder="Enter Exercise"
//                                                                     value={ss.exercise_id}
//                                                                     onChange={e => {
//                                                                         updateSuperset(lift, setIndex, ssIndex, "exercise_id", e.target.value)
//                                                                         setInnerOpen([setIndex, ssIndex, true])
//                                                                     }}
//                                                                     onBlur={() => setTimeout(() => {
//                                                                         if (innerOpen[1] === ssIndex) setInnerOpen([setIndex, ssIndex, false])
//                                                                     }, 100)}
//                                                                     onClick={() => setInnerOpen([setIndex, ssIndex, true])}
//                                                                 />
//
//                                                                 {(innerOpen[0] === setIndex && innerOpen[1] === ssIndex && innerOpen[2] && ss.exercise_id) && (
//                                                                     <ul className={styles.suggestions}>
//                                                                         {innerResults.map((item, i) => (
//                                                                             <li
//                                                                                 key={i}
//                                                                                 onClick={() => {
//                                                                                     updateSuperset(lift, setIndex, ssIndex, "exercise_id", item)
//                                                                                     setInnerOpen([setIndex, ssIndex, false])
//                                                                                 }}
//                                                                             >
//                                                                                 {item}
//                                                                             </li>
//                                                                         ))}
//                                                                     </ul>
//                                                                 )}
//                                                             </div>
//
//                                                             <div className={styles.field}>
//                                                                 <label className={styles.label}>
//                                                                     Weight:
//                                                                     <input
//                                                                         type="number"
//                                                                         className={styles.input}
//                                                                         value={Number(ss.weight).toString()}
//                                                                         onChange={e => updateSuperset(lift, setIndex, ssIndex, "weight", +e.target.value)}
//                                                                     />
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className={styles.field}>
//                                                                 <label className={styles.label}>
//                                                                     Reps:
//                                                                     <input
//                                                                         type="number"
//                                                                         className={styles.input}
//                                                                         value={Number(ss.reps).toString()}
//                                                                         onChange={e => updateSuperset(lift, setIndex, ssIndex, "reps", +e.target.value)}
//                                                                     />
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className={styles.supersetButtons2}>
//                                                                 <button
//                                                                     onClick={() => remSuperset(lift, setIndex, ssIndex)}
//                                                                     className={styles.remButton}>Remove
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//
//                                         <div className={styles.supersetButtons2}>
//                                             <button onClick={() => addSet(lift)} className={styles.addButton}>Add Set
//                                             </button>
//                                             <button onClick={() => {
//                                                 setLift(-1)
//                                                 setAdding(false)
//                                                 pickedExercise(false)
//                                                 setExercise("")
//                                             }} className={styles.compButton}>Done
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//
//                     {last !== undefined && (
//                         <div className={styles.innerCard}>
//                             <h2 className={styles.heading2}>Last Time</h2>
//
//                             <div className={styles.setCard2}>
//                                 {pastWorkout.workouts[last[0]].lifts[last[1]].set.map(((set, setIndex) => (
//                                     <div key={setIndex}>
//                                         <div className={styles.repRow}>
//                                             <label> Set {setIndex + 1} |</label>
//
//                                             <div className={styles.field}>
//                                                 <label> Weight: {set.weight} </label>
//                                             </div>
//
//                                             <div className={styles.field}>
//                                                 <label> Reps: {set.reps} </label>
//                                             </div>
//                                         </div>
//
//                                         <div className={styles.supersetsRow}>
//                                             {set.superset?.map((ss, ssIndex) => (
//                                                 <div key={ssIndex} className={styles.supersets}>
//                                                     <div className={styles.field}>
//                                                         <label className={styles.label2}>
//                                                             Lift: {ss.exercise_id}
//                                                         </label>
//                                                     </div>
//
//                                                     <div className={styles.field}>
//                                                         <label className={styles.label2}>
//                                                             Weight: {ss.weight}
//                                                         </label>
//                                                     </div>
//
//                                                     <div className={styles.field}>
//                                                         <label className={styles.label2}>
//                                                             Reps: {ss.reps}
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )))}
//                             </div>
//                         </div>
//                     )}
//
//                     {pr !== undefined && prSet !== undefined && (
//                         <div className={styles.innerCard}>
//                             <h2 className={styles.heading2}>Personal Record</h2>
//
//                             <div className={styles.setCard2}>
//                                 <div className={styles.repRow}>
//                                     <div className={styles.field}>
//                                         <label> Weight: {prSet.weight} </label>
//                                     </div>
//
//                                     <div className={styles.field}>
//                                         <label> Reps: {prSet.reps} </label>
//                                     </div>
//                                 </div>
//
//                                 <div className={styles.supersetsRow}>
//                                     {prSet.superset?.map((ss, ssIndex) => (
//                                         <div key={ssIndex} className={styles.supersets}>
//                                             <div className={styles.field}>
//                                                 <label className={styles.label2}>
//                                                     Lift: {ss.exercise_id}
//                                                 </label>
//                                             </div>
//
//                                             <div className={styles.field}>
//                                                 <label className={styles.label2}>
//                                                     Weight: {ss.weight}
//                                                 </label>
//                                             </div>
//
//                                             <div className={styles.field}>
//                                                 <label className={styles.label2}>
//                                                     Reps: {ss.reps}
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Recorded Workouts */}
//                     {((workout.lifts.length > 0 && !adding) || (workout.lifts.length > 1)) && (
//                         <div className={styles.innerCard}>
//                             <h2 className={styles.heading2}>Recorded Lifts</h2>
//
//                             {workout.lifts.map(((value, index) => (
//                                 index !== lift && (
//                                     <div key={index} className={styles.setCard2}>
//                                         <div className={styles.headerDone}>
//                                             <h4>{value.exercise_id}</h4>
//                                             <button onClick={() => {
//                                                 console.log(pastWorkout.lastLifted)
//                                                 pickedExercise(true)
//                                                 setAdding(true)
//                                                 setLift(index)
//                                             }} className={styles.compButtonRec}>Edit
//                                             </button>
//                                             <button onClick={() => remLift(index)}
//                                                     className={styles.remButtonRec}>Remove
//                                             </button>
//                                         </div>
//
//                                         {value.set.map((set, setIndex) => (
//                                             <div key={setIndex}>
//                                                 <div className={styles.repRow}>
//                                                     <label> Set {setIndex + 1} |</label>
//
//                                                     <div className={styles.field}>
//                                                         <label> Weight: {set.weight} </label>
//                                                     </div>
//
//                                                     <div className={styles.field}>
//                                                         <label> Reps: {set.reps} </label>
//                                                     </div>
//                                                 </div>
//
//                                                 <div className={styles.supersetsRow}>
//                                                     {set.superset?.map((ss, ssIndex) => (
//                                                         <div key={ssIndex} className={styles.supersets}>
//                                                             <div className={styles.field}>
//                                                                 <label className={styles.label2}>
//                                                                     Lift: {ss.exercise_id}
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className={styles.field}>
//                                                                 <label className={styles.label2}>
//                                                                     Weight: {ss.weight}
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className={styles.field}>
//                                                                 <label className={styles.label2}>
//                                                                     Reps: {ss.reps}
//                                                                 </label>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )
//                             )))}
//                         </div>
//                     )}
//
//                     <div className={styles.controlButtons}>
//                         <button className={styles.completeButton} onClick={() => {
//                             saveWorkout()
//                             navigate("/")
//                         }}>Completed Lift</button>
//
//                         <button className={styles.removeButton2} onClick={() => {
//                             localStorage.removeItem("trackedWorkout")
//                             sessionStorage.removeItem("lift")
//                             setWorkout(NoWorkout)
//                             navigate("/")
//                         }}>Cancel Lift
//                         </button>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }
//
// export function Tracker({account}: { account: AccountData }) {
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         if (account === NoAccount) navigate(`${Pages.AccountManager}`)
//     }, [navigate, account]);
//
//     return (
//         <Outlet/>
//     )
// }
//
// export function ExerciseSearch() {
//     const [query, setQuery] = useState("");
//     const [muscleCategory, setMuscleCategory] = useState("");
//     const [equipment, setEquipment] = useState("");
//     const [muscleCategories, setMuscleCategories] = useState<string[]>([]);
//     const [results, setResults] = useState<ExerciseDB[]>(exerciseDB as ExerciseDB[]);
//     const [filters, setFilters] = useState<string[]>([]);
//     const [selected, setSelected] = useState<string | null>(null);
//     const [showImages, setShowImages] = useState(false);
//
//     const db = exerciseDB as ExerciseDB[];
//     const fuse = useMemo(() => createFuse(db), [db]);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         let filtered = query.trim() ? fuse.search(query).map(r => r.item) : db;
//         if (filters.length && muscleCategory !== "") filtered = filtered.filter(ex => {
//             if (!filters.length) return true;
//             return filters.some(f => {
//                 if (muscleCategory === "Muscles") return ex.primaryMuscles?.includes(f) || ex.secondaryMuscles?.includes(f);
//                 else if (muscleCategory === "Muscle Groups") return MuscleGroups[f as keyof typeof MuscleGroups].some(s => ex.primaryMuscles?.includes(s) || ex.secondaryMuscles?.includes(s))
//                 return true;
//             })
//         });
//         if (equipment.length) filtered = filtered.filter(ex => ex.equipment?.includes(equipment));
//         setResults(filtered);
//     }, [query, filters, fuse, db, muscleCategory, equipment]);
//
//     useEffect(() => {
//         if (muscleCategory === "Muscle Groups") setMuscleCategories(Object.keys(MuscleGroups))
//         else if (muscleCategory === "Muscles") setMuscleCategories(Muscles)
//         else setMuscleCategories([])
//     }, [muscleCategory]);
//
//     return (
//         <div className={homeStyles.page}>
//             <header className={homeStyles.appHeader}>
//                 <div className={homeStyles.headerLeft}>
//                     <img src="icon.png" alt="Workout Tracker Logo" className={homeStyles.logo}/>
//                 </div>
//
//                 <div className={homeStyles.headerCenter}>
//                     <h1 className={homeStyles.title}>Search</h1>
//                 </div>
//
//                 <div className={homeStyles.headerRight}>
//                     <button className={homeStyles.accountIcon} onClick={() => navigate("/")} title="Home">
//                         <Home size={20} color="#f5f5f5" strokeWidth={2}/>
//                     </button>
//                 </div>
//             </header>
//
//             <main className={styles.profileContainer}>
//                 <div className={styles.selectorCard}>
//                     <h1>Workout Tracker</h1>
//
//                     <div className={styles.controls}>
//                         <div className={styles.categoryRow}>
//                             <span className={styles.categoryLabel}>Search Category</span>
//
//                             <select
//                                 className={styles.categorySelect}
//                                 value={muscleCategory}
//                                 onChange={e => setMuscleCategory(e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 <option value="Muscle Groups">Muscle Groups</option>
//                                 <option value="Muscles">Muscles</option>
//                             </select>
//
//                             <span className={styles.categoryLabel}>Select Equipment</span>
//
//                             <select
//                                 className={styles.categorySelect}
//                                 value={equipment}
//                                 onChange={e => setEquipment(e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 <option value="body only">Body Weight</option>
//                                 <option value="machine">Machine</option>
//                                 <option value="foam roll">Foam Roll</option>
//                                 <option value="kettlebells">Kettlebells</option>
//                                 <option value="dumbbell">Dumbbell</option>
//                                 <option value="cable">Cable</option>
//                                 <option value="barbell">Barbell</option>
//                                 <option value="bands">Bands</option>
//                                 <option value="medicine ball">Medicine Ball</option>
//                                 <option value="exercise ball">Exercise Ball</option>
//                                 <option value="e-z curl bar">EZ Curl Bar</option>
//                             </select>
//                         </div>
//
//                         <label className={styles.toggle}>
//                             <span>Show Images</span>
//                             <input
//                                 type="checkbox"
//                                 checked={showImages}
//                                 onChange={e => setShowImages(e.target.checked)}
//                             />
//                             <span className={styles.slider}/>
//                         </label>
//                     </div>
//
//                     <div className={styles.stickySearch}>
//                         <input
//                             className={styles.selectorInput}
//                             placeholder="Search..."
//                             value={query}
//                             onChange={e => setQuery(e.target.value)}
//                         />
//
//                         <div className={styles.pills}>
//                             {muscleCategories.map(tag => (
//                                 <button
//                                     key={tag}
//                                     className={`${styles.pill} ${filters.includes(tag) ? styles.active : ""}`}
//                                     onClick={() => setFilters(f => f.includes(tag) ? f.filter(t => t !== tag) : [...f, tag])}
//                                 >
//                                     {capitalize(tag)}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//
//                     {results.length > 0 && (
//                         <div className={styles.resultsMeta}>
//                             Showing{" "}
//                             <strong>{results.length} </strong>
//                             of <strong>{db.length}</strong>
//                         </div>
//                     )}
//
//                     <div className={styles.results}>
//                         <List
//                             rowCount={results.length}
//                             rowHeight={420}
//                             rowComponent={ExerciseCard}
//                             rowProps={{navigate, results, showImages, selected, setSelected}}
//                         />
//                         {results.length === 0 && (
//                             <p className={styles.noResults}>No exercises found</p>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }
//
// function ExerciseCard({navigate, index, results, showImages, selected, setSelected}: RowComponentProps<{
//     navigate: NavigateFunction,
//     results: ExerciseDB[],
//     showImages: boolean,
//     selected: string | null,
//     setSelected: Dispatch<SetStateAction<string | null>>
// }>) {
//     const exercise = results[index];
//     const images = getExerciseImage(exercise.images);
//     const [expanded, setExpanded] = useState(false);
//     const previewSteps = exercise.instructions.slice(0, 3);
//     const hiddenSteps = exercise.instructions.length - previewSteps.length;
//     const isSelected = selected === exercise.name;
//
//     const toggleSelect = () => {
//         setSelected(prev =>
//             prev === exercise.name ? null : exercise.name
//         );
//     };
//
//     const handleConfirm = () => {
//         navigate(`${Pages.TrackerPage}/${Pages.TrackPage}`, {state: {exercise: exercise.name}});
//     }
//
//     return (
//         <div
//             className={`${styles.exerciseCard} ${isSelected ? styles.selected : ""}`}
//             onClick={toggleSelect}
//         >
//             {isSelected && (
//                 <button
//                     className={styles.checkmark}
//                     onClick={e => {
//                         e.stopPropagation();
//                         handleConfirm();
//                     }}
//                     aria-label="Selected"
//                 >
//                     ✓
//                 </button>
//             )}
//
//             <div className={styles.cardHeader}>
//                 <h3 className={styles.cardTitle}>{exercise.name}</h3>
//             </div>
//
//             <div className={styles.imageWrapper}>
//                 {showImages && (
//                     <img
//                         src={images.start}
//                         loading="lazy"
//                         decoding="async"
//                         width={750}
//                         height={500}
//                         alt={exercise.name}
//                         className={styles.exerciseImage}
//                     />
//                 )}
//             </div>
//
//             <div className={styles.metaRow}>
//                 <span><strong>Level:</strong> {capitalize(exercise.level)}</span>
//                 <span><strong>Equipment:</strong> {exercise.equipment !== null ? capitalize(exercise.equipment) : "None"}</span>
//             </div>
//
//             <ul className={`${styles.instructions} ${expanded ? styles.expanded : ""}`}>
//                 {(expanded ? exercise.instructions : previewSteps).map((step, i) => (
//                     <li key={i}>{step}</li>
//                 ))}
//             </ul>
//
//             {exercise.instructions.length > 3 && (
//                 <button
//                     className={styles.expandButton}
//                     onClick={e => {
//                         e.stopPropagation();
//                         setExpanded(v => !v);
//                     }}
//                 >
//                     {expanded ? "Show less" : `Show ${hiddenSteps} step${hiddenSteps > 1 ? "s" : ""}`}
//                 </button>
//             )}
//         </div>
//     );
// }