// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar1 from "../components/Navbar1";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function Dashboard() {
  // Removed unused state variables (filter, selectedEvent) and unused navigate import
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{ flex: 1 }}>
        <Navbar1 onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <div
        className={`sidebar-backdrop ${isSidebarOpen ? "visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />
    </div>
  );
}
