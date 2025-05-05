import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabItems = [
  "about",
  "experience",
  "education",
  "certifications",
  "projects",
];

const MobileMenu = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}: MobileMenuProps) => {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-50 transform transition-all duration-500 ease-in-out ${
        isOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-end p-6">
        <button
          onClick={onClose}
          className="text-black p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-full -mt-16">
        {tabItems.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-5 px-8 text-xl font-light capitalize transition-colors ${
              activeTab === tab
                ? "text-black font-medium"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
