import React from "react";

const sampleEvents = [
  { date: "02 Nov 2025", event: "Mandala Pooja", volunteers: 25 },
  { date: "15 Dec 2025", event: "Makara Vilakku", volunteers: 120 },
  { date: "21 Dec 2025", event: "Annadanam Camp", volunteers: 15 }
];

export default function EventsList() {
  return (
    <div className="card events-card">
      <h3>Upcoming Events</h3>
      <ul className="events-list">
        {sampleEvents.map((ev, i) => (
          <li key={i}>
            <strong>{ev.date}</strong>
            <div>{ev.event}</div>
            <small>Volunteers: {ev.volunteers}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
