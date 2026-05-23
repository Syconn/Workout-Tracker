import {getDB} from "../config/database.js";

export async function getUserData(username: string) {
    const db = getDB();
    const user = await db.get(`SELECT name, email FROM accounts WHERE username = ?`, [username]);
    return { name: user?.name, email: user?.email, username };
}

export async function updateUserData(username: string, name: string, email: string) {
    const db = getDB();
    await db.run(`UPDATE accounts SET name = ?, email = ? WHERE username = ?`, [name, email, username])
}