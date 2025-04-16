import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/company/dashboard", icon: "📊" },
    { name: "Post Job", path: "/company/jobs", icon: "📝" },
    { name: "Manage Jobs", path: "/company/manage-jobs", icon: "📋" },
    { name: "Applications", path: "/applications", icon: "👥" },
    { name: "Messages", path: "/messages", icon: "💬" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
    { name: "Company Profile", path: "/profile", icon: "🏢" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6">Company Portal</h2>

        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
