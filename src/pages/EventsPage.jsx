// src/pages/EventsPage.jsx
import React, { useState } from "react";
import "./EventsPage.css";

const initialEvents = [
  {
    id: "annadanam",
    title: "Annadanam",
    date: "2025-12-21",
    time: "10:00 AM",
    location: "Community Hall",
    volunteers: 15,
    description:
      "Community feeding (Annadanam) for devotees and pilgrims. Food logistics and volunteer scheduling needed.",
    bookings: [
      { id: 1, name: "S. Raman", address: "Kochi", bookingDate: "2025-11-01", bookingTime: "09:00 AM", advance: 500 },
      { id: 2, name: "R. Leena", address: "Kollam", bookingDate: "2025-11-02", bookingTime: "10:00 AM", advance: 0 },
    ],
  },
  {
    id: "mala_alankarana",
    title: "Mala Alankarana",
    date: "2025-11-10",
    time: "06:30 AM",
    location: "Main Shrine",
    volunteers: 8,
    description:
      "Garland decoration (Mala Alankarana) for the main deity. Coordinate flower supply and decorators.",
    bookings: [],
  },
  {
    id: "goshala_seva",
    title: "Goshala Seva",
    date: "2025-11-25",
    time: "08:00 AM",
    location: "Goshala",
    volunteers: 6,
    description:
      "Service and donations for goshala upkeep and cattle welfare. Manage feed and vet support.",
    bookings: [],
  },
  {
    id: "general_fund",
    title: "General Fund (Donations)",
    date: "-",
    time: "-",
    location: "Temple Fund",
    volunteers: 0,
    description:
      "General temple fund donations to support maintenance and community programs.",
    bookings: [],
  },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0].id);

  const filteredEvents = initialEvents.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedEvent = initialEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="events-page-root">
  
      <div className="events-header">
        <h1>Temple Events Management</h1>
        <p className="muted">View, manage and book temple services</p>
      </div>

      <div className="events-grid">
        
        <div className="events-left">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ marginTop: 14 }}>
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background:
                    selectedEventId === ev.id
                      ? "linear-gradient(to bottom,#fffaf0,#fff5e1)"
                      : "transparent",
                  boxShadow:
                    selectedEventId === ev.id
                      ? "0 4px 12px rgba(198,139,34,0.12)"
                      : "none",
                  border:
                    selectedEventId === ev.id
                      ? "1px solid rgba(198,139,34,0.2)"
                      : "1px solid transparent",
                  marginBottom: "8px",
                }}
              >
                <strong>{ev.title}</strong>
                <div className="muted" style={{ fontSize: "13px" }}>
                  {ev.date !== "-" ? ev.date : "Anytime"} • {ev.location}
                </div>
              </div>
            ))}
          </div>
        </div>

       
        <div className="events-right">
          {selectedEvent ? (
            <>
              <h2 style={{ color: "#8b4513" }}>{selectedEvent.title}</h2>
              <p className="muted" style={{ marginTop: 4 }}>
                {selectedEvent.date !== "-" ? selectedEvent.date : ""}{" "}
                {selectedEvent.time !== "-" ? `• ${selectedEvent.time}` : ""}{" "}
                • {selectedEvent.location}
              </p>
              <p style={{ marginTop: 12 }}>{selectedEvent.description}</p>

              <h3 style={{ marginTop: 20 }}>Bookings ({selectedEvent.bookings.length})</h3>

              {selectedEvent.bookings.length === 0 ? (
                <p className="muted">No bookings yet for this event.</p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 10,
                    background: "#fff",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#fff6e8", color: "#8b4513" }}>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Address</th>
                      <th style={thStyle}>Booking Date</th>
                      <th style={thStyle}>Booking Time</th>
                      <th style={thStyle}>Advance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: "1px solid #f1e9df" }}>
                        <td style={tdStyle}>{b.name}</td>
                        <td style={tdStyle}>{b.address}</td>
                        <td style={tdStyle}>{b.bookingDate}</td>
                        <td style={tdStyle}>{b.bookingTime}</td>
                        <td style={tdStyle}>{b.advance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* <button
                className="btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => alert(`Add booking for ${selectedEvent.title}`)}
              >
                Add Booking
              </button> */}
            </>
          ) : (
            <p className="muted">Select an event to view its details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: "600",
  fontSize: "14px",
};

const tdStyle = {
  padding: "8px 12px",
  fontSize: "14px",
};
