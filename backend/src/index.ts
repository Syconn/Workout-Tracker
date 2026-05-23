import dotenv from "dotenv"
import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import {initDB} from "./config/database.js";
import authRoutes from "./routes/authRoute.js";
import {jwtSecret, port} from "./config/keys.js";
import statusRoutes from "./routes/statusRoutes.js";
import userRoute from "./routes/userRoutes.js";

dotenv.config()

const app = express();
const server = createServer(app);

await initDB();

app.use(cors({
    origin: "http://localhost:5128",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRoutes);
app.use("/status", statusRoutes);
app.use("/user", userRoute);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5128",
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

server.listen(port(), () => {
    console.log("Server running on http://localhost:" + port());
});