// src/components/EventDetails.jsx
import React from "react";
import "./EventDetails.css";

export default function EventDetails({ event, bookings = [] }) {
  return (
    <div className="event-details-card">
      <header className="details-header">
        <div>
          <h2>{event.title}</h2>
          <div className="muted">{event.date} • {event.time} • {event.location}</div>
        </div>

        <div>
          <button
            className="btn-primary"
            onClick={() => alert("Add booking (implement)")}
            type="button"
          >
            Add Booking
          </button>
        </div>
      </header>

      <section className="bookings-list">
        <h3>Bookings ({bookings.length})</h3>

        {bookings.length === 0 ? (
          <div className="muted">No bookings for this event.</div>
        ) : (
          <div className="table-wrap">
            <table className="bookings-table" role="table" aria-label="Event bookings">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Event</th>
                  <th>Booking date</th>
                  <th>Booking time</th>
                  <th>Advance booking</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.address}</td>
                    <td>{b.eventName}</td>
                    <td>{b.bookingDate}</td>
                    <td>{b.bookingTime}</td>
                    <td>{b.advanceBookingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
