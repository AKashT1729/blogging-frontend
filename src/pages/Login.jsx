import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import usePageTitle from "../hooks/usePageTitle";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  usePageTitle("Admin Login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = login(emailOrUsername, password);
    if (success) {
      toast.success("Admin login successful");
      navigate(location.state?.from || "/");
    } else {
      toast.error("Invalid email/username or password");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
