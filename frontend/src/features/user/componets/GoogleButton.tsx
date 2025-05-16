import React from "react";
import socket from "../../../socket/socket";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Googlebutton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`; // Backend route
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  );
};

export default Googlebutton;
