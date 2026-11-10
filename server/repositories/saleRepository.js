
import { getDB } from "../config/db.js";

// Insert a new sale into MongoDB
export async function createSale(saleData) {
  const collection = getDB().collection("sales");

  const result = await collection.insertOne(saleData);

  return {
    _id: result.insertedId,
    ...saleData
  };
}

// Retrieve all recorded sales
export async function getAllSales() {
  const collection = getDB().collection("sales");

  return await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}
