
import {
  createContest,
  getAllContests
} from "../repositories/contestRepository.js";

// Handle a request to create a contest
export async function addContest(req, res) {
  try {
    const {
      title,
      targetAmount,
      startDate,
      endDate
    } = req.body;

    // Validate the contest title
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Contest title is required"
      });
    }

    // Validate the sales target
    if (
      typeof targetAmount !== "number" ||
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0
    ) {
      return res.status(400).json({
        message: "Target amount must be a positive number"
      });
    }

    // Convert date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      !startDate || !endDate ||
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        message: "Provide valid start and end dates"
      });
    }

    const contest = await createContest({
      title: title.trim(),
      targetAmount,
      startDate: start,
      endDate: end,
      createdAt: new Date()
    });

    return res.status(201).json(contest);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create contest"
    });
  }
}

// Handle a request to retrieve contests
export async function fetchContests(req, res) {
  try {
    const contests = await getAllContests();

    return res.status(200).json(contests);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to retrieve contests"
    });
  }
}
