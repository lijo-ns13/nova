import { UserData, Experience } from "../../../../../types/profile";
import { Briefcase, Plus, MoreHorizontal } from "lucide-react";
import { formatDate } from "../../../../../utils/formatters";

interface ExperienceSectionProps {
  userData: UserData;
}

const ExperienceItem = ({
  experience,
  isLast,
}: {
  experience: Experience;
  isLast: boolean;
}) => {
  return (
    <div className="relative group">
      <div className="flex gap-6">
        <div className="w-14 h-14 bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-300 rounded">
          <Briefcase className="w-6 h-6 text-gray-400" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium tracking-tight">
              {experience.title}
            </h3>
            <button className="text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-700 font-medium">{experience.company}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(experience.startDate)} -{" "}
            {formatDate(experience.endDate)}
          </p>
          {experience.location && (
            <p className="text-sm text-gray-500 mt-1">{experience.location}</p>
          )}
          {experience.description && (
            <p className="mt-4 text-gray-600 text-sm whitespace-pre-line font-light leading-relaxed">
              {experience.description}
            </p>
          )}
        </div>
      </div>

      {!isLast && (
        <div className="absolute left-7 top-14 bottom-0 w-px bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
      )}
    </div>
  );
};

const ExperienceSectionViewable = ({ userData }: ExperienceSectionProps) => {
  const experiences = userData?.experiences || [];

  return (
    <section className="bg-white shadow-sm border border-gray-100 p-6 md:p-8 transform transition-all duration-300 hover:shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center uppercase tracking-wider">
          <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
          Experience
        </h2>
        <button className="text-black hover:bg-gray-100 p-2 transition-colors rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <ExperienceItem
              key={exp._id}
              experience={exp}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-50 p-6 mb-4">
            <Briefcase className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-light">No experience listed yet</p>
          <button className="mt-4 text-black border-b border-black hover:border-transparent transition-colors text-sm font-medium">
            Add experience
          </button>
        </div>
      )}
    </section>
  );
};

export default ExperienceSectionViewable;
