// src/components/Navbar1.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, User, LogOut } from "lucide-react";
import "./Navbar1.css";

export default function Navbar1({ onToggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/"); // navigate to login page
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="nav-glass">
      <div className="nav-inner container">
        <div className="nav-left">
          <button
            className="hamburger"
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
            title="Menu"
          >
            <Menu size={18} />
          </button>

          <Link to="/" className="brand">
            <div className="brand-text">
              <span className="brand-main">
                SRI AYYAPPASWAMY TEMPLE DASHBOARD
              </span>
            </div>
          </Link>
        </div>

        <div className="nav-right">
          <nav className="nav-links" role="navigation" aria-label="Main">
            {/* Add nav links if needed */}
          </nav>

          <div className="nav-actions" ref={dropdownRef}>
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={16} />
            </button>

            {/* Profile dropdown */}
            <div className="profile-container">
              <button
                className="profile-btn"
                aria-label="Account"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <User size={16} />
              </button>

              {dropdownOpen && (
                <div className="dropdown fade-in">
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={14} style={{ marginRight: 6 }} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
