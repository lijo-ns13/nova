import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../auth/auth.slice";
import { logOut } from "../services/AuthServices";
import toast from "react-hot-toast";

// Define types for our props
interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

// NavLink component for consistent styling
const NavLink: React.FC<NavLinkProps> = ({ to, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-3 py-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
        isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left"></span>
      )}
    </Link>
  );
};

// Mobile NavLink component
const MobileNavLink: React.FC<NavLinkProps> = ({
  to,
  label,
  isActive,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-3 text-sm font-medium ${
        isActive
          ? "text-green-600 bg-gray-50"
          : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
      } transition-colors duration-200`}
    >
      {label}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logOut();
      dispatch(logout());
      toast.success("logout succesfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check if a route is active
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/feed", label: "Feed" },
    { path: "/jobs", label: "Jobs" },
    { path: "/networking", label: "Networking" },
    { path: "/events", label: "Events" },
  ];

  const actionLinks = [
    { path: "/messages", label: "Messages" },
    { path: "/notifications", label: "Notifications" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/95 py-4"
      }`}
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/feed" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                BRIX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                label={link.label}
                isActive={isActive(link.path)}
              />
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {actionLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 scale-y-100 origin-top shadow-lg"
            : "opacity-0 scale-y-0 origin-top pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          {navLinks.map((link) => (
            <MobileNavLink
              key={link.path}
              to={link.path}
              label={link.label}
              isActive={isActive(link.path)}
            />
          ))}
          {actionLinks.map((link) => (
            <MobileNavLink
              key={link.path}
              to={link.path}
              label={link.label}
              isActive={isActive(link.path)}
            />
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
