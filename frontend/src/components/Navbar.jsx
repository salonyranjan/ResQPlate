import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "ngo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "donor":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-emerald-500 text-gray-900"
        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* LEFT SIDE: Logo & Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center pt-1">
              <Logo />
            </div>

            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {/* If NOT logged in, show Public Links */}
              {!user ? (
                <>
                  <NavLink to="/" className={navLinkClass}>
                    Home
                  </NavLink>
                  <NavLink to="/about" className={navLinkClass}>
                    About Us
                  </NavLink>
                  <NavLink to="/contact" className={navLinkClass}>
                    Contact
                  </NavLink>
                </>
              ) : (
                /* If logged in, show App Links */
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/find-food" className={navLinkClass}>
                    Find Food
                  </NavLink>
                  {(user?.role === "donor" || user?.role === "admin") && (
                    <NavLink to="/donate" className={navLinkClass}>
                      Donate
                    </NavLink>
                  )}
                  {user?.role === "donor" && (
                    <NavLink to="/my-claims" className={navLinkClass}>
                      Manage Donations
                    </NavLink>
                  )}
                  {(user?.role === "ngo" || user?.role === "admin") && (
                    <NavLink to="/my-claims" className={navLinkClass}>
                      My Claims
                    </NavLink>
                  )}
                  {user?.role === "admin" && (
                    <NavLink to="/admin" className={navLinkClass}>
                      Admin
                    </NavLink>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Auth Buttons or User Profile */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-500 hover:text-emerald-600 font-medium transition-colors text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <span
                  className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md border ${getRoleStyle(user?.role)}`}
                >
                  {user?.role}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
