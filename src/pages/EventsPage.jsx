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
      { id: 1, name: "Raman", address: "Kochi", bookingDate: "2025-11-01", bookingTime: "09:00 AM", advance: 500 },
      { id: 2, name: "Leena", address: "Kollam", bookingDate: "2025-11-02", bookingTime: "10:00 AM", advance: 0 },
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

// small util to format "YYYY-MM-DD" => "DD-MM-YY"
function formatDateShort(dateStr) {
  if (!dateStr || dateStr === "-" || dateStr.toLowerCase() === "anytime") return "Anytime";
  // guard for invalid
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const yy = y.slice(-2);
  return `${d}-${m}-${yy}`;
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0].id);

  const filteredEvents = initialEvents.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedEvent = initialEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="events-page-root" role="region" aria-label="Temple events management">
      <div className="events-header">
        <h1>Temple Events Management</h1>
        <p className="muted">View, manage and book temple services</p>
      </div>

      <div className="events-grid">
        <aside className="events-left" aria-label="Events list">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search events"
            />
          </div>

          <div className="events-list" style={{ marginTop: 8 }}>
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className={`event-item ${selectedEventId === ev.id ? "active" : ""}`}
                onClick={() => setSelectedEventId(ev.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedEventId(ev.id);
                }}
              >
                <div className="title">{ev.title}</div>
                <div className="meta event-meta">
                  <span className="date">{ev.date !== "-" ? formatDateShort(ev.date) : "Anytime"}</span>
                  <span className="sep">•</span>
                  <span className="location">{ev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="events-right" aria-live="polite">
          {selectedEvent ? (
            <>
              <h2>{selectedEvent.title}</h2>

              <div className="muted event-meta detail-meta" aria-hidden="false">
                <span className="date">
                  {selectedEvent.date !== "-" ? formatDateShort(selectedEvent.date) : "Anytime"}
                </span>
                {selectedEvent.time && selectedEvent.time !== "-" && <span className="sep">•</span>}
                {selectedEvent.time && selectedEvent.time !== "-" && <span className="time">{selectedEvent.time}</span>}
                <span className="sep">•</span>
                <span className="location">{selectedEvent.location}</span>
              </div>

              <p className="description">{selectedEvent.description}</p>

              <h3>Bookings ({selectedEvent.bookings.length})</h3>

              {selectedEvent.bookings.length === 0 ? (
                <div className="no-bookings muted">No bookings yet for this event.</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Booking Date</th>
                        <th>Booking Time</th>
                        <th>Advance (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.bookings.map((b) => (
                        <tr key={b.id}>
                          <td>{b.name}</td>
                          <td>{b.address}</td>
                          <td>{formatDateShort(b.bookingDate)}</td>
                          <td>{b.bookingTime}</td>
                          <td>{b.advance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <p className="muted">Select an event to view its details.</p>
          )}
        </main>
      </div>
    </div>
  );
}
