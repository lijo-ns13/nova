import React from "react";

const Googlebutton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google"; // Backend route
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
