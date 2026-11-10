
import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [contests, setContests] = useState([]);
  const [contestId, setContestId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load available contests when the page opens
  useEffect(() => {
    async function loadContests() {
      try {
        const response = await fetch("/api/contests");

        if (!response.ok) {
          throw new Error("Failed to fetch contests");
        }

        const data = await response.json();
        setContests(data);

        if (data.length > 0) {
          setContestId(data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    loadContests();
  }, []);

  // Load leaderboard whenever the selected contest changes
  useEffect(() => {
    if (!contestId) return;

    let ignore = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/leaderboard/${contestId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();

        if (!ignore) {
          setLeaderboard(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      ignore = true;
    };
  }, [contestId]);

  // Calculate dashboard statistics from leaderboard data
  const totalSales = leaderboard.reduce(
    (sum, employee) => sum + employee.totalSales,
    0
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <main className="dashboard">
      <header>
        <h1>SalesQuest</h1>
        <p>Sales Performance & Leaderboard Dashboard</p>
      </header>

      <section>
        <label htmlFor="contest">Select Contest</label>

        <select
          id="contest"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
        >
          {contests.map((contest) => (
            <option key={contest._id} value={contest._id}>
              {contest.title}
            </option>
          ))}
        </select>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="stats">
        <div className="card">
          <h3>Total Sales</h3>
          <h2>{formatCurrency(totalSales)}</h2>
        </div>

        <div className="card">
          <h3>Active Sellers</h3>
          <h2>{leaderboard.length}</h2>
        </div>
      </section>

      <section className="card">
        <h2>Leaderboard</h2>

        {loading ? (
          <p>Loading leaderboard...</p>
        ) : leaderboard.length === 0 ? (
          <p>No sales recorded for this contest.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee</th>
                <th>Total Sales</th>
                <th>Sales Count</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.rank}</td>
                  <td>{employee.employeeName}</td>
                  <td>
                    {formatCurrency(employee.totalSales)}
                  </td>
                  <td>{employee.salesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
