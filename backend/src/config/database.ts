import {open, Database } from "sqlite";
import sqlite3 from "sqlite3";

let db: Database

export async function initDB(): Promise<Database> {
    db = await open({
        filename: "./database.sqlite",
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS accounts
        (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT NOT NULL,
            email     TEXT NOT NULL UNIQUE,
            username  TEXT NOT NULL UNIQUE,
            password  TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)

    return db
}

export function getDB() {
    return db;
}