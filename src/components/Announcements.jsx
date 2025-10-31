import React from "react";

const notes = [
  "Makara Jyothi preparation starts from Dec 10.",
  "Volunteers needed for crowd guidance on Dec 15.",
  "Online booking window open for Mandala Pooja."
];

export default function Announcements() {
  return (
    <div className="card announce-card">
      <h3>Announcements</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>🔔 {n}</li>
        ))}
      </ul>
    </div>
  );
}
