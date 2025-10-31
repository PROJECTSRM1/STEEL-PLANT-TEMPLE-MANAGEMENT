// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar1 from "../components/Navbar1";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

// keep TempleIcon and state/handlers as before...

export default function Dashboard() {
  const [filter, setFilter] = useState("All Sevas & Donations");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  // ... stats, statusTabs, events etc (you can move Overview-specific content to src/pages/Overview.jsx)

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{ flex: 1 }}>
        <Navbar1 onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

        <main className="main-content">
          {/* This is where nested routes will render (Overview, SevaBookings, Events...) */}
          <Outlet />
        </main>
      </div>

      {/* backdrop, modals etc (keep as needed) */}
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? "visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />

      {/* Keep your event modal if you want it globally available */}
      {selectedEvent && (
        /* ...modal code... */
        <div className="modal-overlay" role="dialog" aria-modal="true">
          {/* modal content */}
        </div>
      )}
    </div>
  );
}
