import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import MassageModal from "./MassageModal";
import { FaCircleUser } from "react-icons/fa6";

export default function Header() {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const Env = process.env;

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
                <Link
                  className="nav-link border-0 bg-transparent "
                  onClick={() => setShowChat(true)} // ✅ Fixed: changed showChat to setShowChat
                >
                  <MdNotifications size={22} />
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link" data-toggle="dropdown">
                  <FaCircleUser size={24} /> Admin
                </Link>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                  <Link  className="dropdown-item">
                    <div className="media ">
                      <img
                        src={
                          localStorage.getItem("profileImage") ||
                          Env.REACT_APP_PROJECT_ICO
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
                        <p className="text-sm ">
                          {localStorage.getItem("lastName")}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="dropdown-divider"></div>

                  <div className="dropdown-divider"></div>
                  <Link to={"/admin/profile"} class="dropdown-item">
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link to={"/admin/forgetpassword"} class="dropdown-item">
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
            </>
          )}
          {/* ✅ USER MENU */}
          {role === "user" && (
            <>
              {/* ✅ NOTIFICATION ICON (Open Modal) */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link border-0 bg-transparent"
                  onClick={() => setShowChat(true)}
                >
                  <MdNotifications size={22} />
                </Link>
              </li>
              <li className="nav-item dropdown ">
                <Link className="nav-link " data-toggle="dropdown">
                  <FaCircleUser size={24} /> User
                </Link>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                  <Link href="#" className="dropdown-item">
                    <div className="media ">
                      <img
                        src={
                          localStorage.getItem("profileImage") ||
                          Env.REACT_APP_PROJECT_ICON
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
                        <p className="text-sm ">
                          {localStorage.getItem("lastName")}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="dropdown-divider"></div>
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
                    <i className="fas fa-building"></i> Company Ditails
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link
                    to={""}
                    class="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Link>
                </div>
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
