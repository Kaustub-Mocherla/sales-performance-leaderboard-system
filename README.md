# SalesQuest — Sales Performance & Leaderboard Management

A full-stack operations dashboard for managing employees, recording sales, running performance contests, and viewing ranked leaderboards.

SalesQuest combines a **React frontend**, an **Express.js REST API**, and **MongoDB**. It is designed as a small, practical business application: sales activity is stored in the database, while leaderboards are calculated from the recorded transactions rather than maintained manually.

## Features

- **Employee management:** Add employees and view existing records, with duplicate email protection.
- **Sales contests:** Create contests with a target amount and start/end dates through the REST API.
- **Sales tracking:** Record sales against a valid employee and contest; retrieve previously recorded sales.
- **Dynamic leaderboard:** Rank employees by total sales for the selected contest, with sales counts and deterministic tie-breaking.
- **Dashboard:** View total contest sales, active sellers, and employee rankings in a React interface.
- **Input validation and error responses:** Check identifiers, amounts, contest dates, and missing records before writing data.

> **Scope:** The current React interface supports employee creation, sales recording, contest selection, and leaderboard viewing. Contest creation is available through the API; it is not yet a form in the frontend.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, JavaScript, Vite, CSS |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB / MongoDB Atlas, MongoDB aggregation pipeline |
| Development | Git, npm, environment variables |

## Architecture

```text
          React + Vite client
                  |
        /api/* (Vite proxy)
                  |
          Express REST API
                  |
       Routes -> Controllers
                  |
             Repositories
                  |
               MongoDB
```

The backend separates HTTP route handling, request validation, and database access into dedicated modules. The leaderboard repository performs aggregation in MongoDB using `$match`, `$group`, `$lookup`, `$unwind`, `$project`, and `$sort`, then the controller assigns display ranks.

## Project Structure

```text
sales-performance-leaderboard-system/
├── client/
│   ├── src/
│   │   ├── App.jsx              # Main dashboard and API interactions
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.ts          # Proxies /api requests to port 5000
├── server/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # HTTP handlers and validation
│   ├── repositories/           # Database queries and aggregation
│   ├── routes/                 # API route definitions
│   ├── index.js                # Express application entry point
│   └── package.json
├── .gitignore
└── README.md
```

## Local Setup

### Prerequisites

- Node.js (a current Node.js 20 LTS-compatible release or newer) and npm
- A MongoDB instance or MongoDB Atlas cluster, with a database user and network access configured
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kaustub-Mocherla/sales-performance-leaderboard-system.git
cd sales-performance-leaderboard-system
```

### 2. Configure the backend environment

Create a **`config.env` file in the repository root** (not inside `server/`):

```dotenv
ATLAS_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER_HOST/?retryWrites=true&w=majority
DB_NAME=salesquest
PORT=5000
```

Replace the example URI with your own MongoDB connection string. Never commit real database credentials or other secrets. The backend start script reads `../config.env` when run from the `server` directory.

### 3. Start the API

```bash
cd server
npm install
npm start
```

The API listens on `http://localhost:5000` by default. It connects to MongoDB at startup and creates a unique index on employee email addresses.

### 4. Start the frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The Vite development server forwards requests beginning with `/api` to `http://localhost:5000`.

**Repository note:** The frontend requires its own `client/package.json` (and ideally its lockfile), including the Vite `dev` script and React dependencies. If these files are missing from your clone, restore and commit them before running the frontend installation commands.

## REST API

Base URL: `http://localhost:5000`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/employees` | List employees |
| `POST` | `/api/employees` | Create an employee |
| `GET` | `/api/contests` | List contests |
| `POST` | `/api/contests` | Create a contest |
| `GET` | `/api/sales` | List sales, newest first |
| `POST` | `/api/sales` | Record a sale |
| `GET` | `/api/leaderboard/:contestId` | Get the ranked leaderboard for a contest |

### Example: Create an employee

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Kumar","email":"alex@example.com","department":"Sales"}'
```

### Example: Create a contest

```bash
curl -X POST http://localhost:5000/api/contests \
  -H "Content-Type: application/json" \
  -d '{"title":"Quarterly Sales Challenge","targetAmount":100000,"startDate":"2026-01-01","endDate":"2026-12-31"}'
```

Copy the returned contest ID. Once a contest exists, refresh the frontend to load it into the contest selector.

### Example: Record a sale

Use existing employee and contest IDs from the API responses:

```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMPLOYEE_OBJECT_ID","contestId":"CONTEST_OBJECT_ID","amount":2500}'
```

Then retrieve the ranking:

```bash
curl http://localhost:5000/api/leaderboard/CONTEST_OBJECT_ID
```

The leaderboard sorts by **total sales (descending)**, then **number of sales (descending)**, then **employee name (ascending)**. Each result includes its display rank, employee name, total sales, and sales count.

## Engineering Details

- **Database-backed ranking:** Uses MongoDB aggregation rather than fetching every sale and grouping it in the browser.
- **Layered backend:** Express routes call controllers, which delegate data access to repositories.
- **Data integrity:** The server creates a unique employee-email index and checks whether referenced employees and contests exist before inserting sales.
- **Error handling:** The API returns appropriate HTTP responses for validation errors, missing resources, duplicates, and internal failures.
- **Frontend updates:** The React app refetches the leaderboard after recording a sale or switching contests.

## Current Limitations & Next Steps

This is a learning and portfolio project, not a production-ready financial or sales system. Useful improvements include:

- Automated API and integration tests
- Authentication and role-based authorization
- Docker-based local development and CI checks
- Contest creation and editing directly in the React interface
- Pagination, filtering, and improved reporting for larger datasets
- Deployment instructions and screenshots of a running demo

## Author

**Mocherla Chandra Kaustub**  
[GitHub](https://github.com/Kaustub-Mocherla) · [LinkedIn](https://www.linkedin.com/in/kaustub-mocherla/)
