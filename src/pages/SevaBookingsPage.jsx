// src/pages/SevaBookingsPage.jsx
import React, { useMemo, useState } from "react";
import "./SevaBookingsPage.css";

/* -------------------- sample data (unchanged) -------------------- */
const initialSevas = [
  {
    id: "pushpa",
    name: "Pushpabhishekam",
    short: "Flower offering to the deity",
    schedule: "Daily • 7:00 PM",
    bookings: [
      { id: 1, name: "Manoj Kumar", email: "manoj@example.com", phone: "9876543210", address: "Kochi", bookingDate: "2025-11-05", bookingTime: "19:00", notes: "Family of 4" },
      { id: 2, name: "Soma Devi", email: "soma@example.com", phone: "9845123456", address: "Kollam", bookingDate: "2025-11-09", bookingTime: "19:00", notes: "" },
      { id: 3, name: "keerthi", email: "keerthi@example.com", phone: "9848723456", address: "delhi", bookingDate: "2025-10-09", bookingTime: "19:00", notes: "" },
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
      { id: 4, name: "Ramesh", email: "ramesh@mail.com", phone: "9444001122", address: "Trivandrum", bookingDate: "2025-11-02", bookingTime: "08:30", notes: "Urgent" },
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

/* -------------------- small SVG chart components -------------------- */

/**
 * LineChartSVG
 * - props.data: [{label: "2025-11-01", value: 3}, ...]
 * - renders simple line + circles; width responsive via viewBox
 */
function LineChartSVG({ data, height = 120 }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;

  const width = Math.max(300, data.length * 48); // keep reasonable spacing
  const padding = { top: 12, bottom: 24, left: 28, right: 12 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxV = Math.max(...data.map(d => d.value), 1);

  // compute points
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * innerW;
    const y = padding.top + (1 - d.value / maxV) * innerH;
    return { ...d, x, y };
  });

  // path
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");

  // horizontal grid lines (3)
  const gridLines = [0, 0.5, 1].map(t => {
    const y = padding.top + (1 - t) * innerH;
    return y;
  });

  return (
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bookings per day line chart">
      <title>Bookings per day</title>

      {/* grid */}
      {gridLines.map((y, i) => (
        <line key={i} x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#eee" strokeWidth="1" />
      ))}

      {/* path fill (soft) */}
      <path d={`${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`} fill="rgba(198,139,34,0.08)" stroke="none" />

      {/* main path */}
      <path d={pathD} fill="none" stroke="#c68b22" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

      {/* points */}
      {points.map((p, idx) => (
        <g key={idx} transform={`translate(${p.x},${p.y})`} className="chart-point">
          <circle r="4.5" fill="#fff" stroke="#c68b22" strokeWidth="2"></circle>
          <title>{`${p.label}: ${p.value} booking(s)`}</title>
        </g>
      ))}

      {/* labels (x-axis) */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 6} fontSize="10" fill="#6b5a53" textAnchor="middle">
          {p.label.slice(5)}{/* show MM-DD for brevity */}
        </text>
      ))}
    </svg>
  );
}

/**
 * BarChartSVG
 * - props.data: [{label: "2025-06", value: 10}, ...]
 * - simple vertical bars with titles
 */
function BarChartSVG({ data, height = 120 }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;

  const width = Math.max(320, data.length * 60);
  const padding = { top: 12, bottom: 30, left: 28, right: 12 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxV = Math.max(...data.map(d => d.value), 1);
  const barWidth = innerW / data.length * 0.62;

  return (
    <svg className="bar-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bookings per month bar chart">
      <title>Bookings per month</title>
      {data.map((d, i) => {
        const x = padding.left + (i / data.length) * innerW + (innerW / data.length - barWidth) / 2;
        const h = (d.value / maxV) * innerH;
        const y = padding.top + (innerH - h);
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} rx="6" ry="6" fill="#d79b2f" opacity={0.94} />
            <title>{`${d.label}: ${d.value} booking(s)`}</title>
            <text x={x + barWidth / 2} y={height - 8} fontSize="11" fill="#6b5a53" textAnchor="middle">
              {d.label.slice(5)}{/* show MM */}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------- helper functions for date ranges and aggregations -------------------- */
function toYMD(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function toYM(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}
function parseYMD(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* -------------------- main page component -------------------- */
export default function SevaBookingsPage() {
  const [sevas] = useState(initialSevas);
  const [search, setSearch] = useState("");
  const [selectedSevaId, setSelectedSevaId] = useState(sevas[0]?.id || null);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const defaultDay = `${yyyy}-${mm}-${dd}`;
  const defaultMonth = `${yyyy}-${mm}`;

  const [viewMode, setViewMode] = useState("day");
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  /* filtered sevas */
  const filteredSevas = sevas.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.short.toLowerCase().includes(search.toLowerCase())
  );
  // const selectedSeva = sevas.find(s => s.id === selectedSevaId);

  /* bookings for chosen periods */
  const bookingsForDay = useMemo(() => {
    if (!selectedDay) return [];
    return sevas.flatMap(seva =>
      seva.bookings
        .filter(b => b.bookingDate === selectedDay)
        .map(b => ({ ...b, sevaId: seva.id, sevaName: seva.name }))
    );
  }, [sevas, selectedDay]);

  const bookingsForMonth = useMemo(() => {
    if (!selectedMonth) return [];
    return sevas.flatMap(seva =>
      seva.bookings
        .filter(b => b.bookingDate.startsWith(selectedMonth))
        .map(b => ({ ...b, sevaId: seva.id, sevaName: seva.name }))
    );
  }, [sevas, selectedMonth]);

  /* stats */
  const stats = useMemo(() => {
    const totalSevas = sevas.length;
    const inPeriodBookings = viewMode === "day" ? bookingsForDay : bookingsForMonth;
    const eventsConducted = new Set(inPeriodBookings.map(b => b.sevaId)).size;
    const nowYMD = toYMD(new Date());
    const completedEvents = new Set(inPeriodBookings.filter(b => b.bookingDate < nowYMD).map(b => b.sevaId)).size;
    return { totalSevas, eventsConducted, totalBookings: inPeriodBookings.length, completedEvents };
  }, [sevas, bookingsForDay, bookingsForMonth, viewMode]);

  /* groupings used in UI (unchanged) */
  const dayGrouped = useMemo(() => {
    const bySeva = {};
    bookingsForDay.forEach(b => {
      if (!bySeva[b.sevaId]) bySeva[b.sevaId] = { sevaId: b.sevaId, sevaName: b.sevaName, bookings: [] };
      bySeva[b.sevaId].bookings.push(b);
    });
    return Object.values(bySeva);
  }, [bookingsForDay]);

  const monthSummary = useMemo(() => {
    const map = {};
    bookingsForMonth.forEach(b => {
      if (!map[b.sevaId]) map[b.sevaId] = { sevaId: b.sevaId, sevaName: b.sevaName, bookings: [], completed: 0 };
      map[b.sevaId].bookings.push(b);
      if (b.bookingDate < toYMD(new Date())) map[b.sevaId].completed += 1;
    });
    return Object.values(map).sort((a, b) => b.bookings.length - a.bookings.length);
  }, [bookingsForMonth]);

  /* -------------------- create chart data -------------------- */

  // Line chart: last 7 days centered on selectedDay (selectedDay is end)
  const lineData = useMemo(() => {
    const center = parseYMD(selectedDay);
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(center);
      d.setDate(center.getDate() - (6 - i)); // produce 7 consecutive days ending at selectedDay
      return toYMD(d);
    });
    return days.map(dayStr => {
      const count = sevas.reduce((acc, s) => acc + s.bookings.filter(b => b.bookingDate === dayStr).length, 0);
      return { label: dayStr, value: count };
    });
  }, [sevas, selectedDay]);

  // Bar chart: last 6 months ending at selectedMonth
  const barData = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const base = new Date(y, m - 1, 1);
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(base);
      d.setMonth(base.getMonth() - (5 - i)); // 6 months window
      return toYM(d);
    });
    return months.map(ym => {
      const count = sevas.reduce((acc, s) => acc + s.bookings.filter(b => b.bookingDate.startsWith(ym)).length, 0);
      return { label: ym, value: count };
    });
  }, [sevas, selectedMonth]);

  return (
    <div className="seva-page-root premium">
      <div className="seva-header">
        <h1> Seva Bookings</h1>
        <p className="muted">Premium admin dashboard — view and manage seva bookings</p>
      </div>

      {/* Controls */}
      <div className="controls-row">
        <div className="segmented">
          <button className={viewMode === "day" ? "seg active" : "seg"} onClick={() => setViewMode("day")}>Day</button>
          <button className={viewMode === "month" ? "seg active" : "seg"} onClick={() => setViewMode("month")}>Month</button>
        </div>

        <div className="period-inputs">
          {viewMode === "day" ? (
            <input type="date" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} />
          ) : (
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          )}
        </div>

        <div className="search-wrap">
          <input placeholder="Search sevas or keywords..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-title">Total Sevas</div>
          <div className="stat-value">{stats.totalSevas}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Events in period</div>
          <div className="stat-value">{stats.eventsConducted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total bookings</div>
          <div className="stat-value">{stats.totalBookings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Completed events</div>
          <div className="stat-value">{stats.completedEvents}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-head">
            <div className="ev-title">Bookings — Last 7 days</div>
            <div className="muted">Daily bookings (ending {selectedDay})</div>
          </div>
          <div className="chart-body">
            <LineChartSVG data={lineData} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-head">
            <div className="ev-title">Bookings — Last 6 months</div>
            <div className="muted">Monthly totals (ending {selectedMonth})</div>
          </div>
          <div className="chart-body">
            <BarChartSVG data={barData} />
          </div>
        </div>
      </div>

      <div className="seva-grid">
        {/* Left column - seva list */}
        <aside className="seva-left">
          <div className="seva-list">
            {filteredSevas.map(s => (
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
            {filteredSevas.length === 0 && <div className="muted" style={{ padding: 12 }}>No sevas match your search.</div>}
          </div>
        </aside>

        {/* Right column - period detail */}
        <section className="seva-right">
          {viewMode === "day" ? (
            <>
              <div className="period-head">
                <h2>Day view — {selectedDay}</h2>
                <p className="muted">{dayGrouped.length} event(s) on this day • {bookingsForDay.length} total bookings</p>
              </div>

              {dayGrouped.length === 0 ? (
                <div className="no-bookings">No events or bookings found for this day.</div>
              ) : (
                dayGrouped.map(g => (
                  <div className="period-event-card" key={g.sevaId}>
                    <div className="period-event-head">
                      <div>
                        <div className="ev-title" style={{ marginBottom: 6 }}>{g.sevaName}</div>
                        <div className="muted">{sevas.find(s=>s.id===g.sevaId)?.schedule ?? ""}</div>
                      </div>
                      <div className="period-count">{g.bookings.length} booking(s)</div>
                    </div>

                    <div className="table-wrap">
                      <table className="bookings-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Booking time</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.bookings.map(b => (
                            <tr key={b.id}>
                              <td>{b.name}</td>
                              <td>{b.phone ?? "-"}</td>
                              <td>{b.bookingTime ?? "-"}</td>
                              <td>{b.notes || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              <div className="period-head">
                <h2>Month view — {selectedMonth}</h2>
                <p className="muted">{monthSummary.length} seva(s) with bookings • {bookingsForMonth.length} bookings</p>
              </div>

              {monthSummary.length === 0 ? (
                <div className="no-bookings">No events or bookings found for this month.</div>
              ) : (
                <div className="month-grid">
                  {monthSummary.map(summ => (
                    <div className="month-card" key={summ.sevaId}>
                      <div className="month-card-head">
                        <div className="ev-title">{summ.sevaName}</div>
                        <div className="muted">{summ.bookings.length} bookings</div>
                      </div>

                      <div className="month-card-body">
                        <div className="mini-row"><strong>Completed:</strong> {summ.completed}</div>
                        <div className="mini-row"><strong>Bookings:</strong> {summ.bookings.length}</div>
                        <div style={{ marginTop: 10 }}>
                          <table className="mini-table">
                            <thead>
                              <tr><th>Name</th><th>Date</th><th>Time</th></tr>
                            </thead>
                            <tbody>
                              {summ.bookings.slice(0,6).map(b => (
                                <tr key={b.id}>
                                  <td>{b.name}</td>
                                  <td>{b.bookingDate}</td>
                                  <td>{b.bookingTime ?? "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
