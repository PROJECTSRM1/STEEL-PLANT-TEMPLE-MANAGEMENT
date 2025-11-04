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
    date: "01-11-2025",
    method: "GPay",
    amount: 500,
    status: "completed",
  },
  {
    id: 2,
    user: "Anjali Patel",
    paymentType: "Offline",
    event: "Quick Donate",
    date: "30-10-2025",
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
    date: "25-09-2025",
    method: "UPI ID",
    amount: 1000,
    status: "completed",
  },
  {
    id: 4,
    user: "Ramesh Iyer",
    paymentType: "Offline",
    event: "Quick Donate",
    date: "10-10-2025",
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
    date: "05-10-2025",
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
  const statusQuery = params.get("status");

  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  useEffect(() => {
    sessionStorage.setItem("activeSidebar", "donations");
  }, []);

  const methods = useMemo(() => {
    const set = new Set(sampleDonations.map((d) => d.method));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return sampleDonations.filter((d) => {
      if (statusQuery && statusQuery !== "" && d.status !== statusQuery) return false;
      if (filterType !== "All" && d.paymentType !== filterType) return false;
      if (methodFilter !== "All" && d.method !== methodFilter) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        d.user.toLowerCase().includes(s) ||
        d.event.toLowerCase().includes(s) ||
        d.method.toLowerCase().includes(s) ||
        d.date.toLowerCase().includes(s)
      );
    });
  }, [q, filterType, methodFilter, statusQuery]);

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
              <th>Donor</th>
              <th>Donation Type</th>
              <th>Event</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">No donations match your filters.</td>
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
