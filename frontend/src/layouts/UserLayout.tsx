import { Outlet } from "react-router-dom";
import Navbar from "../features/user/componets/NavBar";
import ProfileCard from "../features/user/componets/ProfileCard";

const UserLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - Centered Content */}
      <div className="w-full mx-auto max-w-7xl">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full mx-auto max-w-7xl">
        {/* Profile Card */}
        <aside className="w-64 bg-gray-100 p-4">
          <ProfileCard />
        </aside>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
