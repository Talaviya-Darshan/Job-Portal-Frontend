import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { io } from "socket.io-client";
import MassageModal from "./MassageModal";

export default function Header() {
  const [showChat, setShowChat] = useState(false);
  const [unseenCount, setUnseenCount] = useState();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const meId = localStorage.getItem("id");
  const Env = process.env;

  // 🔌 SOCKET CONNECTION (for unseen count + online sync)
  useEffect(() => {
  const socketUrl = process.env.REACT_APP_SOCKET_URL;
  const s = io(socketUrl, { transports: ["websocket"] });
  if (meId) s.emit("join", { userId: meId }); // identify each user uniquely
  // 👇 Each user gets their own unseen count from backend
  s.on("unseenCount", (count) => {
    setUnseenCount(count);
  });
  return () => s.disconnect();
}, [meId]);

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars text-dark"></i>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
            <>
              {/* 🔔 Notification with unseen count */}
              <li className="nav-item dropdown position-relative">
                <Link
                  className="nav-link border-0 bg-transparent"
                  onClick={() => setShowChat(true)}
                >
                  <MdNotifications size={22} />
                  {unseenCount > 0 && (
                   <span class="badge badge-danger navbar-badge ">{unseenCount}</span>
                  )}
                </Link>
              </li>
            </>
          

          {/* 👤 Admin Menu */}
          {role === "admin" && (
            <li className="nav-item dropdown">
              <Link className="nav-link" data-toggle="dropdown">
                <FaCircleUser size={24} /> Admin
              </Link>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <Link className="dropdown-item">
                  <div className="media">
                    <img
                      src={
                        localStorage.getItem("profileImage") || Env.REACT_APP_PROJECT_ICO
                      }
                      alt="User Avatar"
                      className="img-size-50 mr-3 img-circle"
                    />
                    <div className="media-body">
                      <h3 className="dropdown-item-title">
                        {localStorage.getItem("firstName")}
                        <span className="float-right text-sm text-success">
                          <i className="fas fa-star"></i>
                        </span>
                      </h3>
                      <p className="text-sm">
                        {localStorage.getItem("lastName")}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="dropdown-divider"></div>
                <Link to={"/admin/profile"} className="dropdown-item">
                  <i className="fas fa-user"></i> Profile
                </Link>
                <div className="dropdown-divider"></div>
                <Link to={"/admin/forgetpassword"} className="dropdown-item">
                  <i className="fas fa-lock"></i> Change Password
                </Link>
                <div className="dropdown-divider"></div>
                <Link
                  to={""}
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Link>
              </div>
            </li>
          )}

          {/* 👤 User Menu */}
          {role === "user" && (
            <li className="nav-item dropdown">
              <Link className="nav-link" data-toggle="dropdown">
                <FaCircleUser size={24} /> User
              </Link>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <Link className="dropdown-item">
                  <div className="media">
                    <img
                      src={
                        localStorage.getItem("profileImage") || Env.REACT_APP_PROJECT_ICO
                      }
                      alt="User Avatar"
                      className="img-size-50 mr-3 img-circle"
                    />
                    <div className="media-body">
                      <h3 className="dropdown-item-title">
                        {localStorage.getItem("firstName")}
                        <span className="float-right text-sm text-success">
                          <i className="fas fa-star"></i>
                        </span>
                      </h3>
                      <p className="text-sm">
                        {localStorage.getItem("lastName")}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="dropdown-divider"></div>
                <Link to={"/admin/adminprofile"} className="dropdown-item">
                  <i className="fas fa-user"></i> Profile
                </Link>
                <div className="dropdown-divider"></div>
                <Link to={"/admin/resetpassword"} className="dropdown-item">
                  <i className="fas fa-lock"></i> Change Password
                </Link>
                <div className="dropdown-divider"></div>
                <Link to={"/admin/companyandpackage"} className="dropdown-item">
                  <i className="fas fa-building"></i> Company Details
                </Link>
                <div className="dropdown-divider"></div>
                <Link
                  to={""}
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Link>
              </div>
            </li>
          )}
        </ul>
      </nav>

      {/* 💬 Chat Modal */}
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
