import { UserData } from "../../../../types/profile";
import { Camera } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";

interface ProfileHeaderProps {
  userData: UserData;
}

const ProfileHeader = ({ userData }: ProfileHeaderProps) => {
  const { scrolled } = useScrollPosition();

  return (
    <>
      {/* Fixed header that appears on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "opacity-100 translate-y-0 bg-white/90 backdrop-blur-md py-3 shadow-sm"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={
                    userData?.profilePicture ||
                    "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                  }
                  alt={userData?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{userData?.name}</div>
                <div className="text-xs text-gray-500">
                  {userData?.headline}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-black hover:bg-black/90 active:bg-black/80 text-white font-medium transition-colors text-sm tracking-wide">
                CONNECT
              </button>
              <button className="px-3 py-1.5 bg-transparent border border-black text-black font-medium hover:bg-black/5 active:bg-black/10 transition-colors text-sm tracking-wide">
                MESSAGE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section with cover and profile photo */}
      <section className="relative pt-20 pb-4 overflow-hidden transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white w-full overflow-hidden">
            {/* Cover photo with parallax effect */}
            <div
              className="h-36 sm:h-48 md:h-64 lg:h-80 bg-gradient-to-r from-gray-50 to-gray-100 relative w-full overflow-hidden"
              style={{
                backgroundImage: userData?.coverPhoto
                  ? `url(${userData.coverPhoto})`
                  : undefined,
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent opacity-60"
                style={{
                  transform: scrolled ? "translateY(-5%)" : "translateY(0)",
                  transition: "transform 0.5s ease-out",
                }}
              ></div>

              <button className="absolute right-4 top-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-sm hover:shadow-md transition-all">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-12 pt-2 pb-6 relative">
              {/* Profile picture */}
              <div className="relative -mt-16 sm:-mt-20 md:-mt-24 mb-4 flex justify-between items-end">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-md group relative">
                  <img
                    src={
                      userData?.profilePicture ||
                      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                    }
                    alt={userData?.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex sm:hidden gap-2">
                  <button className="px-3 py-1.5 bg-black hover:bg-black/90 active:bg-black/80 text-white font-medium transition-colors text-sm tracking-wide">
                    CONNECT
                  </button>
                  <button className="px-3 py-1.5 bg-transparent border border-black text-black font-medium hover:bg-black/5 active:bg-black/10 transition-colors text-sm tracking-wide">
                    MESSAGE
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {userData?.name}
                  </h1>
                  {userData?.isVerified && (
                    <span className="inline-block ml-2 text-blue-600">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="text-gray-700 font-light tracking-wide sm:text-lg">
                  {userData?.headline}
                </p>

                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {userData?.location && (
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {userData.location}
                    </span>
                  )}

                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {userData?.experiences && userData.experiences.length > 0
                      ? userData.experiences[0].company
                      : "Not specified"}
                  </span>

                  {userData?.educations && userData.educations.length > 0 && (
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                      {userData.educations[0].institutionName}
                    </span>
                  )}
                </div>

                <div className="text-sm pt-1">
                  <span className="text-black hover:underline cursor-pointer font-medium">
                    {userData?.connections || "500+"} connections
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileHeader;
