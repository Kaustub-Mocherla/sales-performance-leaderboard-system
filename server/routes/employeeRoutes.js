import express from "express";
import {
  addEmployee,
  fetchEmployees
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", addEmployee);
router.get("/", fetchEmployees);

export default router;