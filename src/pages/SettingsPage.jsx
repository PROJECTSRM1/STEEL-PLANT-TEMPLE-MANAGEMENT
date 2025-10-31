// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import SettingsCard from "../components/SettingsCard";
import "./SettingsPage.css";

export default function SettingsPage() {
  // initial load from localStorage (simple persistence)
  const initial = {
    name: localStorage.getItem("admin_name") || "Administrator",
    email: localStorage.getItem("admin_email") || "admin@example.com",
    darkMode: localStorage.getItem("admin_darkMode") === "true",
    notifications: localStorage.getItem("admin_notifications") === "true",
    language: localStorage.getItem("admin_language") || "en",
  };

  const [profile, setProfile] = useState({ name: initial.name, email: initial.email });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [notifications, setNotifications] = useState(initial.notifications);
  const [language, setLanguage] = useState(initial.language);
  const [saving, setSaving] = useState(false);

  // apply simple body class for darkMode preview
  useEffect(() => {
    if (darkMode) document.body.classList.add("app-darkmode");
    else document.body.classList.remove("app-darkmode");
  }, [darkMode]);

  // Save all settings (demo -> localStorage). Replace with API call in production.
  const handleSaveAll = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("admin_name", profile.name);
      localStorage.setItem("admin_email", profile.email);
      localStorage.setItem("admin_darkMode", darkMode.toString());
      localStorage.setItem("admin_notifications", notifications.toString());
      localStorage.setItem("admin_language", language);
      setSaving(false);
      alert("Settings saved");
    }, 700);
  };

  // Simulate password change (validate)
  const handleChangePassword = () => {
    if (!passwords.current || !passwords.newPass) {
      alert("Please fill current and new password");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      alert("New password and confirm do not match");
      return;
    }
    // Replace with API call to change password
    setTimeout(() => {
      setPasswords({ current: "", newPass: "", confirm: "" });
      alert("Password changed successfully");
    }, 600);
  };

  return (
    <div className="settings-page page-card">
      <header className="settings-header">
        <h1>Settings</h1>
        <p className="muted">Manage site, profile and admin preferences (admin only)</p>
      </header>

      <section className="settings-grid">
        {/* Profile Card */}
        <SettingsCard title="Edit Profile" description="Update admin name and contact email.">
          <div className="control-col">
            <label className="label">Name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            />

            <label className="label">Email</label>
            <input
              className="input"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </SettingsCard>

        {/* Change Password */}
        <SettingsCard title="Change Password" description="Change your admin password (current and new).">
          <div className="control-col">
            <label className="label">Current Password</label>
            <input
              className="input"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
            />

            <label className="label">New Password</label>
            <input
              className="input"
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))}
            />

            <label className="label">Confirm New</label>
            <input
              className="input"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
            />

            <button className="btn btn-secondary" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </SettingsCard>

        {/* Dark Mode */}
        <SettingsCard title="Dark Mode" description="Toggle dashboard color mode for admin UI preview.">
          <div className="control-col small">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-text">{darkMode ? "Enabled" : "Disabled"}</span>
            </label>
            <div className="muted small">This toggles a preview only. Persisted on Save.</div>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard title="Notification Preferences" description="Control admin notifications for bookings & donations.">
          <div className="control-col small">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="toggle-text">{notifications ? "On" : "Off"}</span>
            </label>

            <div className="muted small">When enabled, admins receive notifications in the dashboard.</div>
          </div>
        </SettingsCard>

        {/* Language */}
        <SettingsCard title="Language" description="Choose default language for website (front-end).">
          <div className="control-col small">
            <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="ml">Malayalam</option>
            </select>
            <div className="muted small">Change requires front-end to read this setting on render.</div>
          </div>
        </SettingsCard>
      </section>

      <div className="settings-actions">
        <button className="btn" onClick={handleSaveAll} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
