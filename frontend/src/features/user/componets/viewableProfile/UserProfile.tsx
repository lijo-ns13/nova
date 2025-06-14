import { useEffect, useState } from "react";
import { getBasicUserData } from "../../services/ProfileService";
import { Menu } from "lucide-react";
import { UserData } from "../../../../types/profile";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import AboutSectionViewable from "./tabs/AboutSectionViewable";
import ExperienceSectionViewable from "./tabs/ExperienceSectionViewable";
import EducationSectionViewable from "./tabs/EducationSectionViewable";
import CertificationSectionViewable from "./tabs/CertificateSectionViewable";
import ProjectSectionViewable from "./tabs/ProjectSectionViewable";
import LoadingSpinner from "./LoadingSpinner";
import MobileMenu from "./MobileMenu";
import { useAppSelector } from "../../../../hooks/useAppSelector";

interface UserProfileProps {
  username: string;
}

const UserProfile = ({ username }: UserProfileProps) => {
  const { id: ownerId } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  async function fetchData(username: string) {
    setIsLoading(true);
    try {
      const res = await getBasicUserData(username);
      setUserData(res);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData(username);
  }, [username]);

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle user not found
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-sm tracking-[0.2em] font-light">
          USER NOT FOUND
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      {/* <Navbar transparent /> */}

      {/* Mobile menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Profile Header */}
      <ProfileHeader userData={userData} currentUserId={ownerId} />

      {/* Mobile menu button (only visible on small screens) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMenuOpen(true)}
          className="bg-black text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-black/90 active:bg-black/80 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="hidden md:block">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content */}
      <main className="w-full flex justify-center px-4 sm:px-6 pb-16 mt-4">
        <div className="w-full max-w-7xl space-y-5">
          {/* About section */}
          {activeTab === "about" && (
            <AboutSectionViewable userData={userData} />
          )}

          {/* Experience section */}
          {activeTab === "experience" && (
            <ExperienceSectionViewable userData={userData} />
          )}

          {/* Education section */}
          {activeTab === "education" && (
            <EducationSectionViewable userData={userData} />
          )}

          {/* Certifications section */}
          {activeTab === "certifications" && (
            <CertificationSectionViewable userData={userData} />
          )}

          {/* Projects section */}
          {activeTab === "projects" && (
            <ProjectSectionViewable userData={userData} />
          )}
          {/* Post section */}
          {activeTab === "posts" && (
            <ProjectSectionViewable userData={userData} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 mt-8 w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 text-center text-gray-400 text-xs tracking-wider">
          © {new Date().getFullYear()} Professional Profile
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
