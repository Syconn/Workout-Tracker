import express from "express";
import {authenticate} from "../middleware/authMiddleware.js";
import {getLastWorkoutSets, getPR, getUserData, saveWorkout, updateUserData} from "../services/userService.js";

const router = express.Router();

router.get("/info", authenticate, async (req, res) => {
    const username = req.user?.username;
    if (!username) return res.status(401).json({ error: "Unauthorized" });
    const data = await getUserData(username);
    res.json({ info: data });
})

router.post("/updateInfo", authenticate, async (req, res) => {
    const { name, email } = req.body
    const username = req.user?.username;
    if (!username) return res.status(401).json({ error: "Unauthorized" });
    await updateUserData(username, name, email);
    res.json({ info: "success" })
})

router.post("/lastLift", authenticate, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized"});
    const { exerciseId } = req.body
    const data = await getLastWorkoutSets(req.user.id, exerciseId);
    res.json(data);
})

router.post("/pr", authenticate, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized"});
    const { exerciseId } = req.body
    const data = await getPR(req.user.id, exerciseId);
    res.json(data);
})

router.post("/save", authenticate, async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        const { workout } = req.body;
        await saveWorkout(req.user.id, workout);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save workout" });
    }
})

export default router;