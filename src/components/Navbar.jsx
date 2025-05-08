import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-[#208b3a] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white">
            ADT मराठी
          </Link>
          <div className="flex items-center gap-4">
            {user?.isAdmin && (
              <Link 
                to="/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#208b3a] hover:bg-[#186c2e]"
              >
                Create Post
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6 text-white" />
                <span className="text-white">{user.name}</span>
                <button 
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#208b3a] hover:bg-[#186c2e] cursor-pointer"
                >
                  Logout <ArrowRightOnRectangleIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            ) : (
              location.pathname !== "/login" 
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
