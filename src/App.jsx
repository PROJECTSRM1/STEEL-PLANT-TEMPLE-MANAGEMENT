// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecoverPassword from "./pages/RecoverPassword";

// Dashboard and sub-pages
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import SevaBookingsPage from "./pages/SevaBookingsPage";
import EventsPage from "./pages/EventsPage";
import SettingsPage from "./pages/SettingsPage"; // settings page you created

export default function AppWrapper() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recover" element={<RecoverPassword />} />

        {/* Dashboard layout with nested pages */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
        >
          {/* index = /dashboard -> Overview */}
          <Route index element={<Overview />} />

          {/* nested pages appear inside Dashboard's <Outlet /> */}
          <Route path="seva-bookings" element={<SevaBookingsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* you can add /dashboard/reports etc here as nested routes */}
        </Route>

        {/* shortcuts */}
        <Route
          path="/home"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
