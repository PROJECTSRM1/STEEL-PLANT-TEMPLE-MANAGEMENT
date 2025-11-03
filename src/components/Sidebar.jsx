// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Gift, Users, Calendar, BarChart2, Settings } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  

  const items = [
    { to: "/dashboard", label: "Overview", icon: <Home size={16} /> },
    { to: "/dashboard/seva-bookings", label: "Seva Bookings", icon: <Gift size={16} /> },
    { to: "/dashboard/donations", label: "Donations", icon: <Users size={16} /> },
    { to: "/dashboard/events", label: "Events", icon: <Calendar size={16} /> },
    { to: "/dashboard/reports", label: "Reports", icon: <BarChart2 size={16} /> },
    
    { to: "/dashboard/settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <aside className={`sidebar-glass ${isOpen ? "open" : ""}`} aria-label="Sidebar">
      <div className="sidebar-top">
        <div className="thumb">
          <img src="/images/OIP-20.webp" alt="temple" />
        </div>
      </div>

      <nav className="nav-cards" role="navigation">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/dashboard"}       
            className={({ isActive }) => `nav-card ${isActive ? "active" : ""}`}
            onClick={() => { if (onClose) onClose(); }}
          >
            <div className="nav-icon">{it.icon}</div>
            <div className="nav-text">
              <div className="nav-label">{it.label}</div>
              <div className="nav-sub">Manage</div>
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
