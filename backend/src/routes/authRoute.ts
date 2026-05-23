import express from "express";
import {changePassword, login, register, validateUsername} from "../services/authService.js";
import {authenticate} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate", async (req, res) => {
    const { username } = req.body
    const data = await validateUsername(username)
    res.status(200).json({ value: data })
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        await register(name, email, username, password)
        res.status(201);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password, long } = req.body;
        const token = await login(username, password);
        res.cookie("token", token, {httpOnly: true, secure: false, sameSite: "lax", maxAge: long * 24 * 60 * 60 * 1000});
        res.json({ message: "login successful" });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
});

router.post("/changePassword", authenticate, async (req, res) => {
    try {
        const user = req.user as { username?: string } | undefined;
        const username = user?.username;
        if (!username) return res.status(401).json({error: "Unauthorized"});
        const {oldPassword, newPassword} = req.body;
        await changePassword(username, oldPassword, newPassword);
        res.status(201).json({ message: "changed password" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
})

router.post("/logout", (_req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

router.get("/me", authenticate, (req, res) => {
    res.json({ user: req.user });
});

export default router;