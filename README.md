# Workout Tracker v3

A full-stack workout logging application designed to make training data easy to capture, search, and revisit. Workout Tracker v3 combines a modern React UI with a JWT-secured Express + SQLite backend to deliver a cleaner experience than spreadsheets, notes apps, or browser-only storage.

## Highlights

- **Secure user accounts** with cookie-based JWT authentication, login, registration, and profile management.
- **Persistent workout tracking** that saves in-progress sessions locally and writes completed workouts through the backend.
- **Fast exercise discovery** using Fuse.js search and a virtualized list for smoother browsing across the exercise catalog.
- **Structured workout data** served from SQLite and seeded from the bundled `exercises.json` dataset.
- **Modern UI stack** built with React, TypeScript, React Router, Framer Motion, and Lucide icons.

## What This Version Focuses On

Workout Tracker v3 is built around three core workflows:

1. **Account onboarding** — users can register, log in, and update their profile.
2. **Workout creation** — users can start a workout, search exercises, add lifts/sets/supersets, and resume an in-progress session.
3. **Workout persistence** — completed workouts are saved through the backend instead of relying only on browser storage.

This makes the project much more representative of a production-style application and a stronger portfolio piece for demonstrating full-stack product work.

## Architecture

### Client

- React + TypeScript SPA
- React Router for app navigation
- Local/session storage for temporary workout state
- Search and workout editing UI
- API requests sent with credentials so the auth cookie is included automatically

### Backend

- Express API
- SQLite database for users, workouts, and exercise metadata
- bcrypt for password hashing
- JWT authentication stored in an httpOnly cookie
- Seed import for the exercise catalog on first run

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, Framer Motion, Fuse.js, react-window, Lucide React
- **Backend:** Node.js, Express, SQLite, bcrypt, JWT, cookie-parser, CORS
- **Data:** SQLite database + bundled exercise dataset

## Key Features

- Authentication with protected routes
- User profile and account management
- Workout start, track, edit, and save flow
- Exercise catalog search and browsing
- Local persistence for in-progress sessions
- Backend-seeded exercise library with image support

## Project Structure

```text
Workout-Tracker/
├── client/   # React SPA
├── backend/  # Express + SQLite API
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### 1) Start the backend

```powershell
cd backend
npm install
npm run start
```

The backend runs on `http://localhost:4000` by default.

### 2) Start the client

```powershell
cd client
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5128`.

## Build and Preview

### Client build

```powershell
cd client
npm run build
```

### Client preview

```powershell
cd client
npm run preview
```

## Deployment Notes

- The client is configured for GitHub Pages deployment.
- The backend uses CORS and cookie credentials for local development.
- Exercise data is seeded automatically when the database is empty.

## Credits

- Exercise dataset and associated imagery originally sourced from [wrkout/exercises.json](https://github.com/wrkout/exercises.json) by [Ollie Jennings](https://github.com/OllieJennings).

## Roadmap Ideas

- Workout history and progress views
- Trend tracking across lifts and muscle groups
- Cross-device workout synchronization improvements
- Expanded analytics for training consistency and volume
