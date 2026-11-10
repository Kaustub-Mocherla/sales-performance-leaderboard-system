import { getLeaderboard } from "../repositories/leaderboardRepository.js";
import { getContestById } from "../repositories/contestRepository.js";

// Return the ranked leaderboard for a contest
export async function fetchLeaderboard(req, res) {
  try {
    const { contestId } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(contestId)) {
      return res.status(400).json({
        message: "Invalid contest ID"
      });
    }

    const contest = await getContestById(contestId);

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found"
      });
    }

    const leaderboard = await getLeaderboard(contestId);

    const ranked = leaderboard.map((employee, index) => ({
      rank: index + 1,
      ...employee
    }));

    return res.status(200).json(ranked);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve leaderboard"
    });
  }
}