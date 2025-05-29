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
    if (userId) {
      connectSocket();
      socket.emit("login", userId);
    }
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
