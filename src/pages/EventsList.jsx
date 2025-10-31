import React from "react";
import "./EventsList.css";

export default function EventsList({ events = [], selectedId, onSelect = () => {} }) {
  return (
    <div className="events-list-card">
      <h3>Upcoming Events</h3>
      <ul className="events-list">
        {events.map((ev) => {
          const active = ev.id === selectedId;
          return (
            <li
              key={ev.id}
              className={`event-row ${active ? "active" : ""}`}
              onClick={() => onSelect(ev.id)}
            >
              <div className="ev-title">{ev.title}</div>
              <div className="ev-meta">{ev.date} • {ev.time}</div>
              <div className="ev-loc">{ev.location}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
