// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import SettingsCard from "../components/SettingsCard";
import translations from "../utils/translations";
import "./SettingsPage.css"; // keep your existing styles

export default function SettingsPage() {
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

  // translation object for current language
  const t = translations[language] || translations.en;

  useEffect(() => {
    // preview dark mode (your existing behavior)
    if (darkMode) document.body.classList.add("app-darkmode");
    else document.body.classList.remove("app-darkmode");
  }, [darkMode]);

  useEffect(() => {
    // optional: update document title or any global text if you want
    document.title = t.settingsHeader || "Settings";
  }, [language, t]);

  // save all settings (as before)
  const handleSaveAll = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("admin_name", profile.name);
      localStorage.setItem("admin_email", profile.email);
      localStorage.setItem("admin_darkMode", darkMode.toString());
      localStorage.setItem("admin_notifications", notifications.toString());
      localStorage.setItem("admin_language", language);
      setSaving(false);
      alert(t.savedAlert || "Settings saved");
    }, 700);
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.newPass) {
      alert(t.passwordMissingAlert || "Please fill current and new password");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      alert(t.passwordMismatchAlert || "New password and confirm do not match");
      return;
    }

    setTimeout(() => {
      setPasswords({ current: "", newPass: "", confirm: "" });
      alert(t.passwordChangedAlert || "Password changed successfully");
    }, 600);
  };

  // immediate language change handler: updates UI and stores to localStorage
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    // persist immediately so other parts of app can read on next render
    localStorage.setItem("admin_language", lang);
  };

  return (
    <div className="settings-page page-card">
      <header className="settings-header">
        <h1>{t.settingsHeader}</h1>
        <p className="muted">{t.settingsDesc}</p>
      </header>

      <section className="settings-grid">
        {/* Profile Card */}
        <SettingsCard title={t.editProfile} description={t.editProfileDesc}>
          <div className="control-col">
            <label className="label">Name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            />

            <label className="label">Email</label>
            <input
              className="input"
              value={profile.email}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </SettingsCard>

        {/* Change Password */}
        <SettingsCard title={t.changePassword} description={t.changePasswordDesc}>
          <div className="control-col">
            <label className="label">{t.currentPasswordLabel}</label>
            <input
              className="input"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />

            <label className="label">{t.newPasswordLabel}</label>
            <input
              className="input"
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
            />

            <label className="label">{t.confirmNewLabel}</label>
            <input
              className="input"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            />

            <button className="btn btn-secondary" onClick={handleChangePassword}>
              {t.changePasswordBtn}
            </button>
          </div>
        </SettingsCard>

        {/* Dark Mode */}
        <SettingsCard title={t.darkMode} description={t.darkModeDesc}>
          <div className="control-col small">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-text">{darkMode ? t.toggleEnabled : t.toggleDisabled}</span>
            </label>
            <div className="muted small">{/* keep the same short note or translate */}</div>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard title={t.notifications} description={t.notificationsDesc}>
          <div className="control-col small">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="toggle-text">{notifications ? t.toggleOn : t.toggleOff}</span>
            </label>

            <div className="muted small">{/* any extra note could go here */}</div>
          </div>
        </SettingsCard>

        {/* Language */}
        <SettingsCard title={t.language} description={t.languageDesc}>
          <div className="control-col small">
            <select className="select" value={language} onChange={handleLanguageChange}>
              <option value="en">{t.lang_en}</option>
              <option value="te">{t.lang_te}</option>
              <option value="hi">{t.lang_hi}</option>
              <option value="ta">{t.lang_ta}</option>
              <option value="ml">{t.lang_ml}</option>
            </select>
            <div className="muted small">{t.languagePersistNote}</div>
          </div>
        </SettingsCard>
      </section>

      <div className="settings-actions">
        <button className="btn" onClick={handleSaveAll} disabled={saving}>
          {saving ? t.saving : t.saveSettings}
        </button>
      </div>
    </div>
  );
}
