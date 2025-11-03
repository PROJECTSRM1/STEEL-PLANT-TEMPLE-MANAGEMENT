// src/pages/DonationsPage.jsx
import React, { useMemo, useState } from "react";
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
  },
  {
    id: 3,
    user: "Kiran Rao",
    paymentType: "Online",
    event: "Navratri Celebration",
    date: "2025-09-25",
    method: "UPI ID",
    amount: 1000,
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
  },
  {
    id: 5,
    user: "Sita Verma",
    paymentType: "Online",
    event: "Temple Maintenance",
    date: "2025-10-05",
    method: "PhonePe",
    amount: 750,
  },
];

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

const DonationsPage = () => {
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("All"); // All | Online | Offline
  const [methodFilter, setMethodFilter] = useState("All"); // All or specific method (GPay, UPI ID, PhonePe, Hand Cash)

  // compute list of unique methods for method filter dropdown
  const methods = useMemo(() => {
    const set = new Set(sampleDonations.map((d) => d.method));
    return ["All", ...Array.from(set)];
  }, []);

  // filtered & searched results
  const filtered = useMemo(() => {
    return sampleDonations.filter((d) => {
      if (filterType !== "All" && d.paymentType !== filterType) return false;
      if (methodFilter !== "All" && d.method !== methodFilter) return false;
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
  }, [q, filterType, methodFilter]);

  return (
    <div className="donations-page">
      <div className="donations-header">
        <h2>🪔 Donations</h2>

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
                    {d.paymentType === "Online" ? (
                      <Badge>Online</Badge>
                    ) : (
                      <Badge>Offline</Badge>
                    )}
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
                      </>
                    ) : (
                      <span className="note">Paid online via {d.method}</span>
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
