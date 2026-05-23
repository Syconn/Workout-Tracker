import {open, Database } from "sqlite";
import sqlite3 from "sqlite3";

let db: Database

export async function initDB(): Promise<Database> {
    db = await open({ filename: "./database.sqlite", driver: sqlite3.Database })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT NOT NULL,
            email     TEXT NOT NULL UNIQUE,
            username  TEXT NOT NULL UNIQUE,
            password  TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)

    await db.exec(`
        CREATE TABLE IF NOT EXISTS workouts (
            id                TEXT PRIMARY KEY,
            name              TEXT NOT NULL,
            force_type        TEXT,
            level             TEXT,
            mechanic          TEXT,
            equipment         TEXT,
            category          TEXT,
            primary_muscles   TEXT,
            secondary_muscles TEXT,
            instructions      TEXT,
            images            TEXT
        )
    `);

    return db
}

export function getDB() {
    return db;
}