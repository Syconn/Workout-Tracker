import express from "express";
import {getAllWorkouts} from "../services/apiService.js";
import {authenticate} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/workouts", authenticate, async (req, res) => {
    res.json(await getAllWorkouts());
});

router.use("/images", express.static("public/images"));

export default router;