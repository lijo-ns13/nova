import { UserData, Education } from "../../../../../types/profile";
import { GraduationCap, Plus, MoreHorizontal } from "lucide-react";
import { formatDate } from "../../../../../utils/formatters";

interface EducationSectionProps {
  userData: UserData;
}

const EducationItem = ({
  education,
  isLast,
}: {
  education: Education;
  isLast: boolean;
}) => {
  return (
    <div className="relative group">
      <div className="flex gap-6">
        <div className="w-14 h-14 bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-300 rounded">
          <GraduationCap className="w-6 h-6 text-gray-400" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium tracking-tight">
              {education.institutionName}
            </h3>
            <button className="text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-700 font-medium">
            {education.degree}, {education.fieldOfStudy}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(education.startDate)} - {formatDate(education.endDate)}
          </p>

          {education.grade && (
            <div className="mt-3 inline-block bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">
              Grade: {education.grade}
            </div>
          )}

          {education.description && (
            <p className="mt-4 text-gray-600 text-sm whitespace-pre-line font-light leading-relaxed">
              {education.description}
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

const EducationSectionViewable = ({ userData }: EducationSectionProps) => {
  const educations = userData?.educations || [];

  return (
    <section className="bg-white shadow-sm border border-gray-100 p-6 md:p-8 transform transition-all duration-300 hover:shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center uppercase tracking-wider">
          <GraduationCap className="w-5 h-5 mr-3 text-gray-400" />
          Education
        </h2>
        <button className="text-black hover:bg-gray-100 p-2 transition-colors rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {educations.length > 0 ? (
        <div className="space-y-8">
          {educations.map((edu, index) => (
            <EducationItem
              key={edu._id}
              education={edu}
              isLast={index === educations.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-50 p-6 mb-4">
            <GraduationCap className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-light">No education listed yet</p>
          <button className="mt-4 text-black border-b border-black hover:border-transparent transition-colors text-sm font-medium">
            Add education
          </button>
        </div>
      )}
    </section>
  );
};

export default EducationSectionViewable;
