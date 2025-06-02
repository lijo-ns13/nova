import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Auto-redirect after 10 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-md w-full space-y-6 text-center p-8 rounded-xl bg-white dark:bg-gray-700 shadow-lg">
        {/* Animated 404 text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-red-500 dark:text-red-400 opacity-20 absolute -top-16 -left-4 transform -translate-x-1/2 -translate-y-1/2 select-none">
            404
          </h1>
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 relative z-10">
            Oops!
          </h1>
        </div>

        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>

        <p className="text-gray-600 dark:text-gray-300">
          The page you're looking for doesn't exist or has been moved. Don't
          worry, let's get you back on track.
        </p>

        {/* Illustration */}
        <div className="py-6">
          <svg
            className="w-40 h-40 mx-auto text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Return Home
          </button>
        </div>

        {/* Additional help */}
        <div className="pt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Still lost?{" "}
            <button
              onClick={() =>
                (window.location.href = `mailto:support@yourdomain.com?subject=404%20Error%20on%20${encodeURIComponent(
                  window.location.href
                )}`)
              }
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              Contact support
            </button>
          </p>
        </div>
      </div>

      {/* Optional: Search box */}
      <div className="mt-8 w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search our site..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
