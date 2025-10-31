// src/pages/Overview.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonationChart from "../components/DonationChart";
import Announcements from "../components/Announcements";
import "./Overview.css"; // optional - reuse Dashboard.css if you prefer

/* small inline temple SVG used as icon (keeps no extra deps) */
function TempleIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2L3 8h2v7a1 1 0 0 0 1 1h4v-4h4v4h4a1 1 0 0 0 1-1V8h2L12 2z" fill="#c68b22" />
      <circle cx="12" cy="12" r="1.5" fill="#fff6e8" />
    </svg>
  );
}

export default function Overview() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Sevas & Donations");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const stats = {
    visitorsToday: 3482,
    sevaBookings: 276,
    donationsToday: 142500,
    upcomingPoojas: 6,
  };

  const statusTabs = [
    { key: "All Sevas & Donations", label: "🛕 All Sevas & Donations" },
    { key: "Awaiting Blessings", label: "🪔 Awaiting Blessings" },
    { key: "Ongoing Rituals", label: "🔱 Ongoing Rituals" },
    { key: "Blessings Offered", label: "🌼 Blessings Offered" },
  ];

  const events = [
    {
      id: 1,
      day: "02",
      month: "Nov",
      year: 2025,
      title: "Mandala Pooja",
      volunteers: 25,
      location: "Main Shrine",
      description:
        "Mandala Pooja — regular 41-day observance. Special crowd guidance and entry management required.",
    },
    {
      id: 2,
      day: "15",
      month: "Dec",
      year: 2025,
      title: "Makara Vilakku",
      volunteers: 120,
      location: "Temple Courtyard",
      description:
        "Annual Makara Vilakku festival. High footfall expected — coordinate with volunteers and security.",
    },
    {
      id: 3,
      day: "21",
      month: "Dec",
      year: 2025,
      title: "Annadanam Camp",
      volunteers: 15,
      location: "Community Hall",
      description:
        "Community feeding (Annadanam) for devotees and pilgrims. Food logistics and volunteer scheduling needed.",
    },
    {
      id: 4,
      day: "28",
      month: "Dec",
      year: 2025,
      title: "Goshalaseva",
      volunteers: 15,
      location: "Cow Shed",
      description:
        "Service and donations supporting the upkeep, feeding, and welfare of temple cows.",
    },
  ];

  return (
    <div className="page-card">
      <div className="hero">
        <div>
          <h1>Temple Control Center</h1>
          <div className="hero-sub">Swamiye Saranam Ayyappa — monitor temple operations at a glance.</div>
        </div>

        <div>
          <button
            style={{
              background: "var(--accent, #c68b22)",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            Quick Donate
          </button>
        </div>
      </div>

      <div className="stats-row" aria-hidden="false">
        <div className="stat">
          <h4>Daily Visitors</h4>
          <div className="value">{stats.visitorsToday.toLocaleString()}</div>
        </div>
        <div className="stat">
          <h4>Seva Bookings</h4>
          <div className="value">{stats.sevaBookings}</div>
        </div>
        <div className="stat">
          <h4>Donations (₹)</h4>
          <div className="value">₹ {stats.donationsToday.toLocaleString()}</div>
        </div>
        <div className="stat">
          <h4>Upcoming Poojas</h4>
          <div className="value">{stats.upcomingPoojas}</div>
        </div>
      </div>

      <div className="status-tabs" role="tablist" aria-label="Seva and donation status filters">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={filter === tab.key}
            className={`status-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            <span className="status-icon" aria-hidden="true">
              {tab.label.split(" ")[0]}
            </span>
            <span className="status-label">{tab.label.replace(tab.label.split(" ")[0] + " ", "")}</span>
          </button>
        ))}
      </div>

      <div className="mid-grid">
        <div>
          <div className="chart-card">
            <h3>Donation Summary (7 days)</h3>
            <DonationChart filter={filter} />
          </div>

          <div className="announce-card" style={{ marginTop: 14 }}>
            <Announcements />
          </div>
        </div>

        <div>
          <div className="events-card">
            <div className="upcoming-events-section">
              <h3>🗓️ Upcoming Events</h3>

              <div className="events-grid">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="event-card"
                    tabIndex={0}
                    role="button"
                    onClick={() => setSelectedEvent(ev)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedEvent(ev);
                    }}
                    aria-label={`${ev.title} on ${ev.day} ${ev.month} ${ev.year}`}
                  >
                    <div className="event-date" aria-hidden="true">
                      <span className="day">{ev.day}</span>
                      <span className="month">{ev.month}</span>
                    </div>

                    <div className="event-details">
                      <div className="event-title-row">
                        <TempleIcon className="temple-icon" />
                        <h4>{ev.title}</h4>
                      </div>
                      <p className="muted">
                        Volunteers: <strong>{ev.volunteers}</strong> {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, textAlign: "right" }}>
                <button
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(198,139,34,0.15)",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontWeight: 600,
                    color: "#8b4513",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/dashboard/events")}
                >
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event details modal */}
      {selectedEvent && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`Event details for ${selectedEvent.title}`}>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="Close details">
              &times;
            </button>

            <div className="modal-header">
              <div className="modal-date" aria-hidden="true">
                <span className="modal-day">{selectedEvent.day}</span>
                <span className="modal-month">{selectedEvent.month}</span>
                <span className="modal-year">{selectedEvent.year}</span>
              </div>

              <div>
                <h2>{selectedEvent.title}</h2>
                <p className="muted">
                  {selectedEvent.location} • Volunteers: <strong>{selectedEvent.volunteers}</strong>
                </p>
              </div>
            </div>

            <div className="modal-body">
              <p>{selectedEvent.description}</p>

              <div style={{ marginTop: 12 }}>
                <button className="btn-primary" onClick={() => alert("Open scheduling / assign volunteers (implement)")}>
                  Assign Volunteers
                </button>
                <button style={{ marginLeft: 10 }} onClick={() => setSelectedEvent(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
