import express from "express";
import {getAllWorkouts} from "../services/apiService.js";

const router = express.Router();

router.get("/workouts", async (req, res) => {
    res.json(await getAllWorkouts());
});

router.use("/images", express.static("public/images"));

export default router;