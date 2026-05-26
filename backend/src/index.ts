import dotenv from "dotenv"
import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import authRoutes from "./routes/authRoute.js";
import {clientUrl, jwtSecret, port} from "./config/keys.js";
import statusRoutes from "./routes/statusRoutes.js";
import userRoute from "./routes/userRoutes.js";
import {initDB} from "./database/database.js";
import {seedWorkoutsIfEmpty} from "./database/importWorkouts.js";
import apiRoute from "./routes/apiRoute.js";

dotenv.config()
const app = express();
const server = createServer(app);

await initDB();
await seedWorkoutsIfEmpty();

app.use(cors({ origin: clientUrl(), credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRoutes);
app.use("/status", statusRoutes);
app.use("/user", userRoute);
app.use("/api", apiRoute);

const io = new Server(server, {
    cors: {
        origin: clientUrl(),
        credentials: true
    }
});

io.use((socket, next) => {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const token = cookies.token;

        if (!token) return next(new Error("Unauthorized"));
        socket.data.user = jwt.verify(token, jwtSecret());
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

server.listen(Number(port()) || 3000, "0.0.0.0", () => {
    console.log("Server running on port:" + port());
});