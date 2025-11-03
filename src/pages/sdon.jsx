// src/pages/DonationsPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./sdon.css";

const sampleDonations = [
  {
    id: 1,
    user: "Ravi Sharma",
    paymentType: "Online",
    event: "Diwali Pooja",
    date: "2025-11-01",
    method: "GPay",
    amount: 500,
    status: "completed", // completed / awaiting / ongoing
  },
  {
    id: 2,
    user: "Anjali Patel",
    paymentType: "Offline",
    event: "Quick Donate",
    date: "2025-10-30",
    method: "Hand Cash",
    amount: 200,
    seatsAvailable: true,
    status: "awaiting",
  },
  {
    id: 3,
    user: "Kiran Rao",
    paymentType: "Online",
    event: "Navratri Celebration",
    date: "2025-09-25",
    method: "UPI ID",
    amount: 1000,
    status: "completed",
  },
  {
    id: 4,
    user: "Ramesh Iyer",
    paymentType: "Offline",
    event: "Quick Donate",
    date: "2025-10-10",
    method: "PhonePe (Quick Donate)",
    amount: 300,
    seatsAvailable: false,
    status: "completed",
  },
  {
    id: 5,
    user: "Sita Verma",
    paymentType: "Online",
    event: "Temple Maintenance",
    date: "2025-10-05",
    method: "PhonePe",
    amount: 750,
    status: "ongoing",
  },
];

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

const DonationsPage = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const statusQuery = params.get("status"); // awaiting | ongoing | completed | null

  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("All"); // All | Online | Offline
  const [methodFilter, setMethodFilter] = useState("All"); // All or specific method (GPay, UPI ID, PhonePe, Hand Cash)

  // Put active sidebar flag so Sidebar.jsx can highlight Donations when mounted
  useEffect(() => {
    sessionStorage.setItem("activeSidebar", "donations");
    // keep it while on this page. (Sidebar can remove when route changes if you prefer.)
  }, []);

  // compute list of unique methods for method filter dropdown
  const methods = useMemo(() => {
    const set = new Set(sampleDonations.map((d) => d.method));
    return ["All", ...Array.from(set)];
  }, []);

  // filtered & searched results
  const filtered = useMemo(() => {
    return sampleDonations.filter((d) => {
      // status filter from query param
      if (statusQuery && statusQuery !== "" && d.status !== statusQuery) return false;

      // payment type filter
      if (filterType !== "All" && d.paymentType !== filterType) return false;

      // method filter
      if (methodFilter !== "All" && d.method !== methodFilter) return false;

      // search
      if (!q) return true;
      const s = q.toLowerCase();
      // allow search by user name, event, method, date
      return (
        d.user.toLowerCase().includes(s) ||
        d.event.toLowerCase().includes(s) ||
        d.method.toLowerCase().includes(s) ||
        d.date.toLowerCase().includes(s)
      );
    });
  }, [q, filterType, methodFilter, statusQuery]);

  // helper: friendly label if statusQuery present
  const statusLabel = useMemo(() => {
    if (!statusQuery) return "All donations";
    if (statusQuery === "awaiting") return "Awaiting Blessings";
    if (statusQuery === "ongoing") return "Ongoing Rituals";
    if (statusQuery === "completed") return "Blessings Offered";
    return "Filtered donations";
  }, [statusQuery]);

  return (
    <div className="donations-page">
      <div className="donations-header">
        <div>
          <h2>🪔 Donations</h2>
          <div className="muted small">{statusLabel}</div>
        </div>

        <div className="donations-controls">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, event, method or date..."
            className="donations-search"
            aria-label="Search donations"
          />

          <div className="filter-group" role="toolbar" aria-label="Payment type filter">
            <button
              className={filterType === "All" ? "pill active" : "pill"}
              onClick={() => setFilterType("All")}
            >
              All
            </button>
            <button
              className={filterType === "Online" ? "pill active" : "pill"}
              onClick={() => setFilterType("Online")}
            >
              Online
            </button>
            <button
              className={filterType === "Offline" ? "pill active" : "pill"}
              onClick={() => setFilterType("Offline")}
            >
              Offline
            </button>
          </div>

          <select
            className="method-select"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            aria-label="Filter by payment method"
          >
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="donations-stats">
        <div>Total donations: <strong>{sampleDonations.length}</strong></div>
        <div>Showing: <strong>{filtered.length}</strong></div>
        {statusQuery && <div>Status filter: <strong>{statusQuery}</strong></div>}
      </div>

      <div className="table-wrapper">
        <table className="donations-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Event</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">No donations match your filters.</td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id}>
                  <td>{d.user}</td>
                  <td>
                    {d.paymentType === "Online" ? <Badge>Online</Badge> : <Badge>Offline</Badge>}
                  </td>
                  <td>{d.event}</td>
                  <td>{d.date}</td>
                  <td>{d.method}</td>
                  <td>₹{d.amount}</td>
                  <td>
                    {d.paymentType === "Offline" ? (
                      <>
                        {d.method.toLowerCase().includes("hand") ? (
                          <span className="note">Hand cash received</span>
                        ) : (
                          <span className="note">{d.method}</span>
                        )}
                        {typeof d.seatsAvailable !== "undefined" && (
                          <span className={`seat ${d.seatsAvailable ? "available" : "na"}`}>
                            {d.seatsAvailable ? "Seats available" : "No seats"}
                          </span>
                        )}
                        {/* show status chip */}
                        <span className={`status-chip ${d.status}`}>{d.status}</span>
                      </>
                    ) : (
                      <>
                        <span className="note">Paid online via {d.method}</span>
                        <span className={`status-chip ${d.status}`}>{d.status}</span>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsPage;
