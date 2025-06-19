import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../auth/auth.slice";
import { logOut } from "../../user/services/AuthServices";
import socket from "../../../socket/socket";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // 768px == md

  /* ---------- handlers ---------- */
  async function handleLogout() {
    await logOut();
    dispatch(logout());
    socket.disconnect();
    setIsOpen(false); // close the menu after logging out on mobile
  }

  /* ---------- watch viewport ---------- */
  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 768;
      setIsMobile(small);
      if (!small) setIsOpen(false); // force‑close when we leave mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-indigo-800 text-white shadow-md relative z-40">
      {/* top bar */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* logo / brand */}
        <Link to="/admin/dashboard" className="flex items-center">
          <span className="font-bold text-lg sm:text-xl pl-10 sm:pl-10">
            Admin&nbsp;Portal&nbsp;(NOVA)
          </span>
        </Link>

        {/* toggle (mobile) */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* desktop actions */}
        {!isMobile && (
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-indigo-700 rounded hover:bg-indigo-600 transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* mobile dropdown  */}
      {isOpen && isMobile && (
        <div className="absolute left-0 top-full w-full bg-indigo-800 md:hidden border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="block w-full text-left py-3 px-6 hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
