import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {getDB} from "../config/database.js";
import {jwtSecret} from "../config/keys.js";

// TODO BETTER ERROR HANDLING

export async function validateUsername(username: string) {
    const db = getDB();
    return !await db.get(`SELECT id FROM accounts WHERE username = ?`, [username])
}

export async function register(name: string, email: string, username: string, password: string) {
    const db = getDB();

    const existing = await db.get(`SELECT id FROM accounts WHERE email = ? OR username = ?`,
        [email, username]
    );
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.run(`INSERT INTO accounts (name, email, username, password) VALUES (?, ?, ?, ?)`,
        [name, email, username, hashedPassword]
    );
}

export async function login(username: string, password: string) {
    const db = getDB();

    const user = await db.get(
        `SELECT * FROM accounts WHERE username = ?`,
        [username]
    );
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    return jwt.sign({ id: user.id, username: user.username }, jwtSecret(), { expiresIn: "7d" });
}