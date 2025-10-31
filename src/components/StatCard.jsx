import React from "react";

export default function StatCard({ title, value, accent }) {
  return (
    <div className="card stat-card" style={{ borderLeft: `4px solid ${accent || "#fff"}` }}>
      <h4>{title}</h4>
      <div className="value">{value}</div>
    </div>
  );
}
