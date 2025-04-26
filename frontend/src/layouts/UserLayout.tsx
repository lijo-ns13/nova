import { Outlet } from "react-router-dom";
import Navbar from "../features/user/componets/NavBar";
import ProfileCard from "../features/user/componets/ProfileCard";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Fixed Sidebar positioned below Navbar */}
      <ProfileCard />

      {/* Main Content with spacing for Navbar and Sidebar */}
      <div className="lg:ml-64 mt-16 p-4">
        {" "}
        {/* Adjust margins for desktop */}
        <Outlet />
      </div>
    </div>
  );
};
export default UserLayout;
