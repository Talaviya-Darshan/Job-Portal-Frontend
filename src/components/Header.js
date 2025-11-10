import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import  MassageModal from "./MassageModal";

export default function Header() {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars text-dark"></i>
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          {role === "admin" && (
            <>
              <li className="nav-item dropdown">
                <Link className="nav-link" to="/admin/forgetpassword">
                  <i className="fas fa-lock"></i>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link to="/admin/profile" className="nav-link">
                  <i className="fas fa-user"></i>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link border-0 bg-transparent"
                  onClick={() => setShowChat(true)} // ✅ Fixed: changed showChat to setShowChat
                >
                  <MdNotifications size={22} />
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <i className="fas fa-power-off"></i>
                </Link>
              </li>
            </>
          )}
          {/* ✅ USER MENU */}
          {role === "user" && (
            <>
              <li className="nav-item dropdown">
                <Link className="nav-link" to="/admin/resetpassword">
                  <i className="fas fa-lock"></i>
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link to="/admin/adminprofile" className="nav-link">
                  <i className="fas fa-user"></i>
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link to="/admin/companyandpackage" className="nav-link">
                  <i className="fas fa-building"></i>
                </Link>
              </li>

              {/* ✅ NOTIFICATION ICON (Open Modal) */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link border-0 bg-transparent"
                  onClick={() => setShowChat(true)}
                >
                  <MdNotifications size={22} />
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <i className="fas fa-power-off"></i>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Admin chat */}
      {showChat && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <MassageModal closeModal={() => setShowChat(false)} />
        </div>
      )}
    </>
  );
}
