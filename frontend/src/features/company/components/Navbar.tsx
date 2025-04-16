import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../auth/auth.slice";
import { logOut } from "../../user/services/AuthServices";

const Navbar = () => {
  const dispatch = useAppDispatch();

  async function handleLogout() {
    await logOut();
    dispatch(logout());
    alert("Logged out successfully");
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="w-full px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Company Logo */}
          <div>
            <Link to="/dashboard" className="flex items-center">
              <span className="font-bold text-xl text-gray-800">
                CompanyName
              </span>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-gray-200 font-medium text-gray-700 rounded hover:bg-gray-300 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
