import React, { useMemo, useState } from "react";
import "./ReportsPage.css";

/* sample data (replace with API calls in future) */
const sampleReports = [
  { id: 1, category: "Donations", event: "Diwali Pooja", amount: 12000, volunteers: 3, date: "2025-11-01", channel: "Online", donor: "Ravi Sharma" },
  { id: 2, category: "Events", event: "Navratri Celebration", amount: 8000, volunteers: 5, date: "2025-10-15", channel: "Online", donor: "Anjali Patel" },
  { id: 3, category: "Maintenance", event: "Temple Cleanliness Drive", amount: 2500, volunteers: 2, date: "2025-09-30", channel: "Offline", donor: "Local Trust" },
  { id: 4, category: "Donations", event: "Quick Donate", amount: 5000, volunteers: 1, date: "2025-10-10", channel: "Offline", donor: "Sita Verma" },
  { id: 5, category: "Events", event: "Mandala Pooja", amount: 10000, volunteers: 4, date: "2025-11-03", channel: "Online", donor: "Kiran Rao" },
  { id: 6, category: "Donations", event: "Temple Maintenance", amount: 750, volunteers: 0, date: "2025-10-05", channel: "Online", donor: "Sita Verma" }
];

function formatCurrency(n) {
  return `₹${n.toLocaleString()}`;
}

/* sparkline path */
function sparklinePath(values, width = 120, height = 40) {
  if (!values || values.length === 0) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const len = values.length;
  const px = (i) => (i / (len - 1)) * width;
  const py = (v) => {
    if (max === min) return height / 2;
    return height - ((v - min) / (max - min)) * height;
  };
  let d = `M ${px(0)} ${py(values[0])}`;
  for (let i = 1; i < len; i++) d += ` L ${px(i)} ${py(values[i])}`;
  return d;
}

/* donut arc path */
function donutArcs(percent, cx = 50, cy = 50, r = 36) {
  const angle = percent * Math.PI * 2;
  const large = angle > Math.PI ? 1 : 0;
  const x2 = cx + r * Math.sin(angle);
  const y2 = cy - r * Math.cos(angle);
  const d = `M ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${cx} ${cy} Z`;
  return d;
}

/* ---------------- HeatmapCalendar component ----------------
   Props:
     - year, month (1-based month), countsMap (object: 'YYYY-MM-DD' -> {count, items})
*/
function HeatmapCalendar({ year, month, countsMap }) {
  // month: 1-12
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay(); // 0=Sun..6=Sat
  const daysInMonth = new Date(year, month, 0).getDate();

  // build array of day cells with date string
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const yyyy = year;
    const mm = String(month).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const key = `${yyyy}-${mm}-${dd}`;
    const info = countsMap[key] || { count: 0, items: [] };
    cells.push({ day: d, key, ...info });
  }

  // max for intensity scaling
  const max = Math.max(...cells.map(c => (c ? c.count : 0)), 1);

  return (
    <div className="heatmap-root" aria-hidden={false}>
      <div className="heatmap-header">
        <div className="heatmap-month">{first.toLocaleString("default", { month: "long", year: "numeric" })}</div>
        <div className="heatmap-legend">
          <span className="legend-dot l0" /> <small>0</small>
          <span className="legend-dot l1" /> <small>1–{Math.max(1, Math.ceil(max/3))}</small>
          <span className="legend-dot l2" /> <small>{Math.ceil(max/3)+1}–{Math.ceil((2*max)/3)}</small>
          <span className="legend-dot l3" /> <small>{Math.ceil((2*max)/3)+1}+ </small>
        </div>
      </div>

      <div className="heatmap-grid" role="grid" aria-label={`Volunteer assignments for ${first.toLocaleString("default", { month: "long", year: "numeric" })}`}>
        {/* week day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="heatmap-weekday">{d}</div>
        ))}

        {/* cells */}
        {cells.map((c, idx) => {
          if (!c) return <div key={idx} className="heatmap-cell empty" />;
          const intensity = Math.round((c.count / max) * 3); // 0..3
          const cls = `heatmap-cell v${intensity}`;
          const title = c.count
            ? `${c.count} volunteer${c.count > 1 ? "s" : ""}\n${c.items.map(it => `${it.event} (${it.volunteers})`).join("\n")}`
            : "No assignments";
          return (
            <div
              key={c.key}
              className={cls}
              title={title}
              aria-label={`${c.day} - ${c.count} volunteers`}
              role="gridcell"
            >
              <div className="hm-day">{c.day}</div>
              {c.count > 0 && <div className="hm-count">{c.count}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- ReportsPage main ---------------- */
export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // months present in sample data
  const months = useMemo(() => {
    const set = new Set(sampleReports.map(s => new Date(s.date).toLocaleString("default", { month: "long" })));
    return ["All", ...Array.from(set)];
  }, []);

  // filtered records
  const filtered = useMemo(() => {
    return sampleReports.filter(r => {
      const month = new Date(r.date).toLocaleString("default", { month: "long" });
      const okMonth = selectedMonth === "All" || month === selectedMonth;
      const okCat = selectedCategory === "All" || r.category === selectedCategory;
      return okMonth && okCat;
    });
  }, [selectedMonth, selectedCategory]);

  // totals and aggregates
  const totals = useMemo(() => {
    const totalDonations = filtered.filter(f => f.category === "Donations").reduce((s, r) => s + r.amount, 0);
    const totalVolunteers = filtered.reduce((s, r) => s + r.volunteers, 0);
    const totalEvents = new Set(filtered.filter(f => f.category === "Events" || f.category === "Donations" || f.category === "Maintenance").map(f => f.event)).size;
    const online = filtered.filter(f => f.channel === "Online").reduce((s, r) => s + r.amount, 0);
    const offline = filtered.filter(f => f.channel === "Offline").reduce((s, r) => s + r.amount, 0);
    const grouped = {};
    filtered.forEach(r => { grouped[r.date] = (grouped[r.date] || 0) + r.volunteers; });
    const sortedDates = Object.keys(grouped).sort();
    const trend = sortedDates.map(d => grouped[d]);
    const donors = {};
    sampleReports.forEach(r => { donors[r.donor] = (donors[r.donor] || 0) + r.amount; });
    const topDonors = Object.entries(donors).sort((a,b)=>b[1]-a[1]).slice(0,4);
    return { totalDonations, totalVolunteers, totalEvents, online, offline, trend, topDonors, sortedDates, grouped };
  }, [filtered]);

  const donationSplit = totals.online + totals.offline === 0 ? 0.5 : totals.online / (totals.online + totals.offline);

  // Decide which month/year to show in heatmap
  const heatmapMonthInfo = useMemo(() => {
    if (selectedMonth !== "All") {
      // pick year from first filtered item matching that month or current year as fallback
      const match = sampleReports.find(r => new Date(r.date).toLocaleString("default", { month: "long" }) === selectedMonth);
      const dt = match ? new Date(match.date) : new Date();
      return { year: dt.getFullYear(), month: dt.getMonth() + 1 };
    } else {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
  }, [selectedMonth]);

  // Build countsMap for heatmap: 'YYYY-MM-DD' -> {count, items[]}
  const countsMap = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      const key = r.date;
      if (!map[key]) map[key] = { count: 0, items: [] };
      map[key].count += r.volunteers;
      map[key].items.push({ event: r.event, volunteers: r.volunteers });
    });
    return map;
  }, [filtered]);

  return (
    <div className="page-card reports-visual-root">
      <div className="reports-header">
        <div>
          <h1>📈 Temple Reports — Visual Overview</h1>
          <p className="muted">Premium insights for administrators — trends, donors, events and volunteer health.</p>
        </div>

        <div className="filters">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map(m => <option key={m}>{m}</option>)}
          </select>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option>All</option>
            <option>Donations</option>
            <option>Events</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>

      {/* Top KPI row */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-title">Total Donations</div>
          <div className="kpi-value">{formatCurrency(totals.totalDonations)}</div>
          <div className="kpi-sub">Online {formatCurrency(totals.online)} • Offline {formatCurrency(totals.offline)}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Total Events</div>
          <div className="kpi-value">{totals.totalEvents}</div>
          <div className="kpi-sub">Unique events in selection</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Total Volunteers</div>
          <div className="kpi-value">{totals.totalVolunteers}</div>
          <div className="kpi-sub">Assigned across events</div>
        </div>

        <div className="spark-card">
          <div className="kpi-title">Volunteer Trend</div>
          <svg viewBox="0 0 120 40" className="sparkline" aria-hidden>
            <path d={sparklinePath(totals.trend, 120, 40)} fill="none" stroke="#c68b22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="kpi-sub small">Dates: {totals.sortedDates.slice(0,5).join(", ")}</div>
        </div>
      </div>

      {/* Middle row: donut + timeline + top donors */}
      <div className="middle-row">
        <div className="donut-card">
          <h3>Donation Channels</h3>
          <svg width="160" height="160" viewBox="0 0 100 100" role="img" aria-label="donut">
            <circle cx="50" cy="50" r="36" fill="#fff6e8" />
            <path d={donutArcs(donationSplit)} fill="#4bb77b" opacity="0.95" />
            <circle cx="50" cy="50" r="28" fill="#fff" />
            <text x="50" y="50" textAnchor="middle" alignmentBaseline="central" fontSize="10" fill="#333">{Math.round(donationSplit*100)}%</text>
          </svg>
          <div className="donut-legend">
            <div><span className="legend-dot online" /> Online {formatCurrency(totals.online)}</div>
            <div><span className="legend-dot offline" /> Offline {formatCurrency(totals.offline)}</div>
          </div>
        </div>

        <div className="timeline-card">
          <h3>Upcoming / Recent Events</h3>
          <div className="timeline-list">
            {filtered.slice(0,5).map(item => (
              <div key={item.id} className="timeline-item">
                <div className="ti-date">{item.date}</div>
                <div className="ti-body">
                  <div className="ti-title">{item.event}</div>
                  <div className="ti-meta">{item.category} • {item.volunteers} volunteers • {formatCurrency(item.amount)}</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="muted">No events found for current filters.</div>}
          </div>
        </div>

        <div className="donors-card">
          <h3>Top Donors</h3>
          <div className="donor-list">
            {totals.topDonors.map(([name, amt], idx) => (
              <div key={name} className="donor-item">
                <div className="donor-rank">{idx+1}</div>
                <div className="donor-info">
                  <div className="donor-name">{name}</div>
                  <div className="donor-amt">{formatCurrency(amt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New: Heatmap calendar */}
      <div className="heatmap-section">
        <HeatmapCalendar year={heatmapMonthInfo.year} month={heatmapMonthInfo.month} countsMap={countsMap} />
      </div>

      {/* Events card grid (non-tabular) */}
      

      {/* Volunteer availability bar */}
      <div className="availability-row">
        <h3>Volunteer Availability Snapshot</h3>
        <div className="availability-bar">
          <div className="avail-label">Assigned</div>
          <div className="avail-track">
            <div className="avail-fill" style={{ width: `${Math.min(100, (totals.totalVolunteers/Math.max(1, (totals.totalVolunteers+5))) * 100)}%` }} />
          </div>
          <div className="avail-count">{totals.totalVolunteers} assigned</div>
        </div>
      </div>

      {/* actions */}
      <div className="reports-actions">
        <button className="btn-primary">Export Snapshot</button>
        <button className="btn-ghost" onClick={() => { setSelectedCategory("All"); setSelectedMonth("All"); }}>Reset Filters</button>
      </div>
    </div>
  );
}
