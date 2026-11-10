
import { useEffect, useState } from "react";
import "./App.css";

// Helper for communicating with our Express backend
async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [contests, setContests] = useState([]);
  const [contestId, setContestId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    department: "Sales"
  });

  const [saleForm, setSaleForm] = useState({
    employeeId: "",
    amount: ""
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load employees and contests when React starts
  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [employeeData, contestData] = await Promise.all([
          apiRequest("/employees"),
          apiRequest("/contests")
        ]);

        if (!active) return;

        setEmployees(employeeData);
        setContests(contestData);

        if (contestData.length > 0) {
          setContestId(contestData[0]._id);
        }
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  // Reload leaderboard whenever the contest or sales change
  useEffect(() => {
    if (!contestId) {
      setLeaderboard([]);
      return;
    }

    let active = true;

    async function loadLeaderboard() {
      try {
        const data = await apiRequest(
          `/leaderboard/${contestId}`
        );

        if (active) setLeaderboard(data);
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    setLeaderboard([]);
    loadLeaderboard();

    return () => {
      active = false;
    };
  }, [contestId, refreshKey]);

  // Add an employee through our Express API
  async function handleAddEmployee(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const employee = await apiRequest("/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeForm)
      });

      // Add the returned employee to React state
      setEmployees(prev => [...prev, employee]);

      // Select the new employee in the sales form
      setSaleForm(prev => ({
        ...prev,
        employeeId: employee._id
      }));

      setEmployeeForm({
        name: "",
        email: "",
        department: "Sales"
      });

      setMessage("Employee added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Record a sale through our Express API
  async function handleRecordSale(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!contestId || !saleForm.employeeId) {
      setError("Please select an employee and contest.");
      return;
    }

    const amount = Number(saleForm.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid positive sale amount.");
      return;
    }

    setSaving(true);

    try {
      await apiRequest("/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          employeeId: saleForm.employeeId,
          contestId,
          amount
        })
      });

      setSaleForm(prev => ({
        ...prev,
        amount: ""
      }));

      // Trigger the leaderboard useEffect again
      setRefreshKey(prev => prev + 1);

      setMessage("Sale recorded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const formatCurrency = amount =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  const totalSales = leaderboard.reduce(
    (sum, employee) => sum + employee.totalSales,
    0
  );

  return (
    <main className="dashboard">
      <header>
        <h1>SalesQuest</h1>
        <p>Sales Performance & Leaderboard Management</p>
      </header>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <section className="card">
        <label htmlFor="contest">Selected Contest</label>

        <select
          id="contest"
          value={contestId}
          onChange={e => setContestId(e.target.value)}
        >
          <option value="">Select a contest</option>

          {contests.map(contest => (
            <option key={contest._id} value={contest._id}>
              {contest.title}
            </option>
          ))}
        </select>
      </section>

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

      <section className="form-grid">
        {/* Employee creation form */}
        <form
          className="card form-card"
          onSubmit={handleAddEmployee}
        >
          <h2>Add Employee</h2>

          <label htmlFor="name">Employee Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter employee name"
            value={employeeForm.name}
            onChange={e => setEmployeeForm(prev => ({
              ...prev,
              name: e.target.value
            }))}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="employee@example.com"
            value={employeeForm.email}
            onChange={e => setEmployeeForm(prev => ({
              ...prev,
              email: e.target.value
            }))}
            required
          />

          <label htmlFor="department">Department</label>
          <input
            id="department"
            type="text"
            value={employeeForm.department}
            onChange={e => setEmployeeForm(prev => ({
              ...prev,
              department: e.target.value
            }))}
          />

          <button type="submit" disabled={saving}>
            Add Employee
          </button>
        </form>

        {/* Sales recording form */}
        <form
          className="card form-card"
          onSubmit={handleRecordSale}
        >
          <h2>Record Sale</h2>

          <label htmlFor="employee">Select Employee</label>
          <select
            id="employee"
            value={saleForm.employeeId}
            onChange={e => setSaleForm(prev => ({
              ...prev,
              employeeId: e.target.value
            }))}
            required
          >
            <option value="">Choose employee</option>

            {employees.map(employee => (
              <option
                key={employee._id}
                value={employee._id}
              >
                {employee.name}
              </option>
            ))}
          </select>

          <label htmlFor="amount">Sale Amount (INR)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            value={saleForm.amount}
            onChange={e => setSaleForm(prev => ({
              ...prev,
              amount: e.target.value
            }))}
            required
          />

          <button
            type="submit"
            disabled={saving || !contestId}
          >
            Record Sale
          </button>
        </form>
      </section>

      {/* Leaderboard */}
      <section className="card">
        <h2>Leaderboard</h2>

        {leaderboard.length === 0 ? (
          <p>No sales recorded for this contest.</p>
        ) : (
          <div className="table-wrapper">
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
                {leaderboard.map(employee => (
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
          </div>
        )}
      </section>
    </main>
  );
}
