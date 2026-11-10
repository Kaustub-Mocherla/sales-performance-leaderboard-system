
import { ObjectId } from "mongodb";

import {
  createSale,
  getAllSales
} from "../repositories/saleRepository.js";

import {
  getEmployeeById
} from "../repositories/employeeRepository.js";

import {
  getContestById
} from "../repositories/contestRepository.js";

// Validate a MongoDB ID supplied as a string
function isValidId(id) {
  return typeof id === "string" &&
    /^[a-fA-F0-9]{24}$/.test(id);
}

// Handle a request to record a sale
export async function addSale(req, res) {
  try {
    const { employeeId, contestId, amount } = req.body;

    // Validate the employee and contest IDs
    if (!isValidId(employeeId) || !isValidId(contestId)) {
      return res.status(400).json({
        message: "Invalid employee or contest ID"
      });
    }

    // Validate the sales amount
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be a positive number"
      });
    }

    // Check whether the employee exists
    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    // Check whether the contest exists
    const contest = await getContestById(contestId);

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found"
      });
    }

    // Record the sale using MongoDB ObjectIds
    const sale = await createSale({
      employeeId: new ObjectId(employeeId),
      contestId: new ObjectId(contestId),
      amount,
      createdAt: new Date()
    });

    return res.status(201).json(sale);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to record sale"
    });
  }
}

// Handle a request to retrieve sales
export async function fetchSales(req, res) {
  try {
    const sales = await getAllSales();

    return res.status(200).json(sales);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to retrieve sales"
    });
  }
}
