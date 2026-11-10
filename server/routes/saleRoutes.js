import express from "express";

import {
  addSale,
  fetchSales
} from "../controllers/saleController.js";

const router = express.Router();

router.post("/", addSale);
router.get("/", fetchSales);

export default router;