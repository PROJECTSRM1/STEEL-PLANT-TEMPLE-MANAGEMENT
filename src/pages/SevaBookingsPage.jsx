// src/pages/SevaBookingsPage.jsx
import React, { useState, useMemo } from "react";
import "./SevaBookingsPage.css";

/*
  Sample data - replace with API calls when ready.
  I've included common Ayyappa sevas (Pushpabhishekam, Ashtabhishekam, Archana, Neyyabhishekam, Annadanam, Goshala Seva).
*/
const initialSevas = [
  {
    id: "pushpa",
    name: "Pushpabhishekam",
    short: "Flower offering to the deity",
    schedule: "Daily • 7:00 PM",
    bookings: [
      { id: 1, name: "Manoj Kumar", email: "manoj@example.com", phone: "9876543210", address: "Kochi", bookingDate: "2025-11-05", bookingTime: "19:00", notes: "Family of 4" },
      { id: 2, name: "Soma Devi", email: "soma@example.com", phone: "9845123456", address: "Kollam", bookingDate: "2025-11-09", bookingTime: "19:00", notes: "" },
    ]
  },
  {
    id: "ashta",
    name: "Ashtabhishekam",
    short: "Eight-item abhishekam ritual",
    schedule: "Weekly • Fri 6:00 AM",
    bookings: []
  },
  {
    id: "archana",
    name: "Archana",
    short: "Name chanting & offering",
    schedule: "Daily • multiple slots",
    bookings: [
      { id: 3, name: "Ramesh", email: "ramesh@mail.com", phone: "9444001122", address: "Trivandrum", bookingDate: "2025-11-02", bookingTime: "08:30", notes: "Urgent" },
    ]
  },
  {
    id: "neyya",
    name: "Neyyabhishekam",
    short: "Ghee abhishekam offering",
    schedule: "Monthly special slots",
    bookings: []
  },
  {
    id: "annadanam",
    name: "Annadanam",
    short: "Community feeding service",
    schedule: "Special days / requests",
    bookings: []
  },
  {
    id: "goshala",
    name: "Goshala Seva",
    short: "Care & donations for temple cows",
    schedule: "On request",
    bookings: []
  }
];

export default function SevaBookingsPage() {
  const [sevas] = useState(initialSevas);
  const [search, setSearch] = useState("");
  const [selectedSevaId, setSelectedSevaId] = useState(sevas[0]?.id || null);

  const filtered = useMemo(
    () =>
      sevas.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.short.toLowerCase().includes(search.toLowerCase())
      ),
    [sevas, search]
  );

  const selected = sevas.find(s => s.id === selectedSevaId);

  return (
    <div className="seva-page-root">
      <div className="seva-header">
        <h1>Ayyappa Swamy — Seva Bookings</h1>
        <p className="muted">Admin dashboard — view and manage seva bookings</p>
      </div>

      <div className="seva-grid">
        {/* Left: list of sevas */}
        <aside className="seva-left">
          <div className="search-box">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sevas or keywords..."
            />
          </div>

          <div className="seva-list">
            {filtered.map(s => (
              <button
                key={s.id}
                className={`event-card seva-item ${selectedSevaId === s.id ? "active" : ""}`}
                onClick={() => setSelectedSevaId(s.id)}
                aria-pressed={selectedSevaId === s.id}
              >
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div className="ev-title">{s.name}</div>
                  <div className="ev-meta muted">{s.short}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 110 }}>
                  <div className="ev-meta muted" style={{ fontSize: 13 }}>{s.schedule}</div>
                  <div style={{ marginTop: 8, fontWeight: 700, color: "#8b4513" }}>
                    {s.bookings.length} booked
                  </div>
                </div>
              </button>
            ))}

            {filtered.length === 0 && <div className="muted" style={{ padding: 12 }}>No sevas match your search.</div>}
          </div>
        </aside>

        {/* Right: details & bookings */}
        <section className="seva-right">
          {selected ? (
            <>
              <div className="details-head">
                <h2>{selected.name}</h2>
                <div className="muted">{selected.schedule} • Volunteers: {selected.volunteers ?? "-"}</div>
                <p style={{ marginTop: 12 }}>{selected.description ?? selected.short}</p>
              </div>

              <div className="bookings-wrap">
                <div className="bookings-header">
                  <h3>Bookings ({selected.bookings.length})</h3>
                  <div>
                    {/* <button className="btn-primary" onClick={() => alert("Open add-booking modal (implement)")}>Add Booking</button> */}
                  </div>
                </div>

                {selected.bookings.length === 0 ? (
                  <div className="no-bookings muted">No bookings yet for this seva.</div>
                ) : (
                  <div className="table-wrap">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Booking date</th>
                          <th>Slot/time</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.bookings.map(b => (
                          <tr key={b.id}>
                            <td>{b.name}</td>
                            <td>{b.email ?? "-"}</td>
                            <td>{b.phone ?? "-"}</td>
                            <td>{b.address ?? "-"}</td>
                            <td>{b.bookingDate}</td>
                            <td>{b.bookingTime || "-"}</td>
                            <td>{b.notes || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="muted">Select a seva to view details and bookings.</div>
          )}
        </section>
      </div>
    </div>
  );
}
