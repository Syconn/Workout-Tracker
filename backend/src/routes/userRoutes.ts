import express from "express";
import {authenticate} from "../middleware/authMiddleware.js";
import {getUserData, updateUserData} from "../services/userService.js";

const router = express.Router();

router.get("/info", authenticate, async (req, res) => {
    const user = req.user as { username?: string } | undefined;
    const username = user?.username;
    if (!username) return res.status(401).json({ error: "Unauthorized" });
    const data = await getUserData(username);
    res.json({ info: data });
})

router.post("/updateInfo", authenticate, async (req, res) => {
    const { name, email } = req.body
    const user = req.user as { username?: string } | undefined;
    const username = user?.username;
    if (!username) return res.status(401).json({ error: "Unauthorized" });
    await updateUserData(username, name, email);
    res.json({ info: "success" })
})

export default router;