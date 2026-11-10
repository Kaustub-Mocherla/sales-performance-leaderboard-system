
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Calculate employee rankings for a given contest
export async function getLeaderboard(contestId) {
  const db = getDB();

  return await db.collection("sales").aggregate([
    // Filter sales belonging to this contest
    {
      $match: {
        contestId: new ObjectId(contestId)
      }
    },

    // Group sales by employee
    {
      $group: {
        _id: "$employeeId",
        totalSales: { $sum: "$amount" },
        salesCount: { $sum: 1 }
      }
    },

    // Retrieve employee details
    {
      $lookup: {
        from: "employees",
        localField: "_id",
        foreignField: "_id",
        as: "employee"
      }
    },

    // Convert employee array into an object
    {
      $unwind: "$employee"
    },

    // Select the fields returned by our API
    {
      $project: {
        _id: 0,
        employeeId: "$_id",
        employeeName: "$employee.name",
        totalSales: 1,
        salesCount: 1
      }
    },

    // Rank employees by highest sales amount
    {
      $sort: {
        totalSales: -1,
        salesCount: -1,
        employeeName: 1
      }
    }
  ]).toArray();
}
