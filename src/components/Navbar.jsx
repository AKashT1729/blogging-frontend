import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              My Blog
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    Logout <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
