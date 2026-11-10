import express from "express";
import cors from "cors";

import { connectDB, getDB } from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import contestRoutes from "./routes/contestRoutes.js"
import saleRoutes from "./routes/saleRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 5000;

// Connect to Atlas before starting the API
async function startServer() {
  try {
    await connectDB();

    // Prevent duplicate employee emails
    await getDB()
      .collection("employees")
      .createIndex({ email: 1 }, { unique: true });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();