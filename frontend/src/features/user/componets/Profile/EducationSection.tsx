import { useEffect, useState } from "react";
import AddEducationModal from "./Forms/AddEducationModal";
import { getEducations, deleteEducation } from "../../services/ProfileService";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import EditEducationModal from "./Forms/EditEducationModal";

interface Education {
  institutionName: string;
  _id: string;
  degree: string;
  fieldOfStudy: string;
  grade: string;
  startDate: string;
  endDate: string;
  description: string;
}
function EducationSection() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEducation, setEditEducation] = useState<Education | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchEducations();
  }, []);

  async function fetchEducations() {
    try {
      setIsLoading(true);
      const res = await getEducations(id);
      setEducations(res);
    } catch (err) {
      console.error("Failed to fetch educations", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEducationAdded = () => {
    setIsModalOpen(false);
    setEditEducation(null);
    fetchEducations();
  };

  const handleEdit = (education: Education) => {
    setEditEducation(education);
    setIsModalOpen(true);
  };

  const handleDelete = async (educationId: string) => {
    if (confirm("Are you sure you want to delete this education?")) {
      try {
        await deleteEducation(id, educationId);
        fetchEducations();
      } catch (error) {
        console.error("Failed to delete education", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDuration = (startDate: string, endDate?: string) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Education
            </h2>
            <p className="text-gray-600 mt-1">
              Highlight your academic background and qualifications
            </p>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            onClick={() => {
              setEditEducation(null);
              setIsModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Education
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : educations.length > 0 ? (
          <div className="space-y-6">
            {educations.map((edu: Education) => (
              <div
                key={edu._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {edu.institutionName}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5 text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {getDuration(edu.startDate, edu.endDate)}
                        </div>
                        {edu.fieldOfStudy && (
                          <div className="flex items-center text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5 text-indigo-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            {edu.fieldOfStudy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {edu.description && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Details:
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {edu.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 sm:p-12 text-center">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No education details added yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Add your academic qualifications to showcase your educational
              background.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Your First Education
            </button>
          </div>
        )}

        {isModalOpen &&
          (editEducation ? (
            <EditEducationModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditEducation(null);
              }}
              education={editEducation}
              onEducationUpdated={handleEducationAdded}
            />
          ) : (
            <AddEducationModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditEducation(null);
              }}
              onEducationAdded={handleEducationAdded}
            />
          ))}
      </div>
    </div>
  );
}

export default EducationSection;
