import { useRef, useEffect } from "react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabItems = [
  "about",
  "experience",
  "education",
  "certifications",
  "projects",
  "posts",
];

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view horizontally on mobile
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const container = tabsRef.current;
      const activeTabElement = activeTabRef.current;

      // Calculate position to center the active tab
      const scrollLeft =
        activeTabElement.offsetLeft -
        container.offsetWidth / 2 +
        activeTabElement.offsetWidth / 2;

      // Smooth scroll to position
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full pt-0 pb-6 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div
          ref={tabsRef}
          className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {tabItems.map((tab) => (
            <button
              key={tab}
              ref={tab === activeTab ? activeTabRef : null}
              onClick={() => setActiveTab(tab)}
              className={`relative py-4 px-4 sm:px-6 text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "text-black font-medium"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300 ease-out"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
