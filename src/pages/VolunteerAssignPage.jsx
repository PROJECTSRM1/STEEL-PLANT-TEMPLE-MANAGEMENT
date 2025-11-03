// src/pages/VolunteerAssignPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./VolunteerAssignPage.css";
/*
  NOTE: this component intentionally does not change any CSS.
  It uses your existing styles. If you need a CSS file later
  we can add one, but you asked for no CSS changes.
*/

/* sample volunteers */
const initialVolunteers = [
  { id: "v1", name: "K. Ramesh", phone: "9876543210", onLeave: false },
  { id: "v2", name: "S. Lakshmi", phone: "9876500011", onLeave: false },
  { id: "v3", name: "P. Suresh", phone: "9876533322", onLeave: true }, // on leave -> shows "No status"
  { id: "v4", name: "M. Radha", phone: "9876544400", onLeave: false },
];

/* sample assignments: volunteerId, eventId, date (YYYY-MM-DD) */
const initialAssignments = [
  { volunteerId: "v1", eventId: "1", date: "2025-11-02" }, // v1 assigned to this event/date in sample
  { volunteerId: "v4", eventId: "99", date: "2025-11-02" }, // v4 assigned elsewhere same date
];

export default function VolunteerAssignPage() {
  const { id: eventId } = useParams(); // event id
  const location = useLocation();
  const navigate = useNavigate();

  // read date from query string ?date=YYYY-MM-DD
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const eventDate = params.get("date") || "";

  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [assignments, setAssignments] = useState(initialAssignments);

  // compute assignments relevant to the current date
  const assignmentsForDate = useMemo(
    () => assignments.filter((a) => a.date === eventDate),
    [assignments, eventDate]
  );

  // helper checks
  const isAssignedToThisEvent = (volId) =>
    assignments.some((a) => a.volunteerId === volId && a.eventId === String(eventId) && a.date === eventDate);

  const isAssignedOnDateElsewhere = (volId) =>
    assignments.some((a) => a.volunteerId === volId && a.date === eventDate && String(a.eventId) !== String(eventId));

  // Assign volunteer (adds an assignment)
  const assignVolunteer = (volId) => {
    const vol = volunteers.find((v) => v.id === volId);
    if (!vol) return;

    // if on leave -> cannot assign
    if (vol.onLeave) {
      // spec: show "No status" label for on leave and prevent assign
      alert(`${vol.name} is on leave — cannot assign.`);
      return;
    }

    // if already assigned elsewhere on the same date -> prevent assign
    if (isAssignedOnDateElsewhere(volId)) {
      alert(`${vol.name} is already assigned to another event on ${eventDate}.`);
      return;
    }

    // if already assigned to this event -> do nothing
    if (isAssignedToThisEvent(volId)) return;

    // add assignment
    setAssignments((prev) => [...prev, { volunteerId: volId, eventId: String(eventId), date: eventDate }]);
  };

  // Unassign from this event (on this date)
  const unassignVolunteer = (volId) => {
    setAssignments((prev) =>
      prev.filter(
        (a) =>
          !(
            a.volunteerId === volId &&
            String(a.eventId) === String(eventId) &&
            a.date === eventDate
          )
      )
    );
  };

  // Toggle leave (admin can mark on-leave). When marking on-leave, remove any assignments for that date.
  const toggleLeave = (volId) => {
    setVolunteers((prev) => prev.map((v) => (v.id === volId ? { ...v, onLeave: !v.onLeave } : v)));

    // if marking on-leave, also remove assignments for that date for that volunteer
    const vol = volunteers.find((v) => v.id === volId);
    if (vol && !vol.onLeave) {
      // vol was available, now being marked on-leave -> remove any assignment on this date
      setAssignments((prev) => prev.filter((a) => !(a.volunteerId === volId && a.date === eventDate)));
    }
  };

  // mark sidebar highlight if you use sessionStorage-based approach (optional)
  useEffect(() => {
    sessionStorage.setItem("activeSidebar", "events"); // or "donations" depending where you want highlight; choose "events"
    return () => {
      // optional cleanup if you want to remove on exit
      // sessionStorage.removeItem("activeSidebar");
    };
  }, []);

  return (
    <div className="page-card assign-vol-root">

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          ← Back
        </button>
        <div>
          <h2 style={{ margin: 0 }}>Assign Volunteers</h2>
          <div style={{ color: "#666", fontSize: 13 }}>{eventDate ? `Date: ${eventDate}` : "No date selected"}</div>
        </div>
        <div />
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3>Volunteers</h3>

          <div style={{ display: "grid", gap: 10 }}>
            {volunteers.map((v) => {
              const assignedThis = isAssignedToThisEvent(v.id);
              const assignedElsewhere = isAssignedOnDateElsewhere(v.id);

              // status label logic per your request
              let statusLabel = "";
              if (assignedThis) statusLabel = "Assigned";
              else if (assignedElsewhere) statusLabel = "Already assigned";
              else if (v.onLeave) statusLabel = "No status"; // per your instruction for 'on leave'
              else statusLabel = "Available";

              return (
                <div key={v.id} style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "white", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{v.name}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>{v.phone}</div>
                    <div style={{ marginTop: 6, color: "#444", fontSize: 13 }}>
                      <strong>Status:</strong> {statusLabel}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    {assignedThis ? (
                      <button onClick={() => unassignVolunteer(v.id)} style={{ padding: "8px 10px" }}>
                        Unassign
                      </button>
                    ) : (
                      <button
                        onClick={() => assignVolunteer(v.id)}
                        disabled={v.onLeave || assignedElsewhere}
                        style={{ padding: "8px 10px", opacity: v.onLeave || assignedElsewhere ? 0.6 : 1, cursor: v.onLeave || assignedElsewhere ? "not-allowed" : "pointer" }}
                        title={v.onLeave ? "Volunteer is on leave" : assignedElsewhere ? "Already assigned on this date" : "Assign volunteer"}
                      >
                        Assign
                      </button>
                    )}

                    <button
                      onClick={() => toggleLeave(v.id)}
                      style={{ padding: "6px 8px", background: "transparent", border: "1px solid #ddd" }}
                    >
                      {v.onLeave ? "Mark Available" : "Mark On Leave"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 360 }}>
          <h3>Assignments for {eventDate || "—"}</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {assignmentsForDate.length === 0 && <div style={{ color: "#666" }}>No assignments for this date.</div>}
            {assignmentsForDate.map((a) => {
              const vol = volunteers.find((v) => v.id === a.volunteerId) || { name: "Unknown" };
              const isThisEvent = String(a.eventId) === String(eventId);
              return (
                <div key={`${a.volunteerId}-${a.eventId}`} style={{ display: "flex", justifyContent: "space-between", padding: 10, background: "white", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{vol.name}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>Event ID: {a.eventId}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ padding: "6px 8px", borderRadius: 8, background: isThisEvent ? "#eaf6ea" : "#fff4f4" }}>
                      {isThisEvent ? "This event" : "Other event"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <button onClick={() => navigate("/dashboard/events")} style={{ padding: "8px 12px" }}>
          Done
        </button>
      </div>
    </div>
  );
}
