import Landing from "./components/Landing";
import UserRoutes from "./routes/UserRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LockedDashboard from "./features/company/pages/LockedDashboard";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "./hooks/useAppSelector";
import socket, { connectSocket } from "./socket/socket";
import { useEffect } from "react";

function App() {
  const { id: userId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userId) return;

    // Always try to connect
    connectSocket();

    // Login once when mounted
    socket.emit("login", userId);

    // On reconnect, emit login again
    const handleReconnect = () => {
      console.log("Reconnected. Re-logging in...");
      socket.emit("login", userId);
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* userroutes */}
        <Route path="/*" element={<UserRoutes />} />

        {/* companyroutes */}
        <Route path="/company/*" element={<CompanyRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/locked-dashboard" element={<LockedDashboard />} />
        <Route path="*" element={<h1>not found</h1>} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
