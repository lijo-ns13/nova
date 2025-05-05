import { UserData } from "../../../../../types/profile";
import { User } from "lucide-react";

interface AboutSectionProps {
  userData: UserData;
}

const AboutSectionViewable = ({ userData }: AboutSectionProps) => {
  return (
    <section className="bg-white shadow-sm border border-gray-100 p-6 md:p-8 transform transition-all duration-300 hover:shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-wider">
        <User className="w-5 h-5 mr-3 text-gray-400" />
        About
      </h2>

      {userData?.about ? (
        <p className="text-gray-700 whitespace-pre-line font-light leading-relaxed">
          {userData.about}
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-gray-50 p-6 mb-4">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-light">No information provided</p>
          <button className="mt-4 text-black border-b border-black hover:border-transparent transition-colors text-sm font-medium">
            Add information
          </button>
        </div>
      )}
    </section>
  );
};

export default AboutSectionViewable;
