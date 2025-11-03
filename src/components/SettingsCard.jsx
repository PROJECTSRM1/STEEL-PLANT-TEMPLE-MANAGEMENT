
import React from "react";
import "./SettingsCard.css"; 

export default function SettingsCard({ title, description, children }) {
  return (
    <div className="settings-card" role="group" aria-label={title}>
      <div className="settings-card-left">
        <h4 className="settings-title">{title}</h4>
        {description && <div className="settings-desc">{description}</div>}
      </div>

      <div className="settings-card-right">
        {children}
      </div>
    </div>
  );
}
