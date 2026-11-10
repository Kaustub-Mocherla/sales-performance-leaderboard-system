import express from "express";

import {
  addContest,
  fetchContests
} from "../controllers/contestController.js";

const router = express.Router();

router.post("/", addContest);
router.get("/", fetchContests);

export default router;