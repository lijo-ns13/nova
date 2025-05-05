import { UserData, Certification } from "../../../../../types/profile";
import { Award, Plus, ExternalLink, Calendar } from "lucide-react";
import { formatDate } from "../../../../../utils/formatters";

interface CertificationSectionProps {
  userData: UserData;
}

const CertificationItem = ({
  certification,
}: {
  certification: Certification;
}) => {
  return (
    <div className="group border border-gray-100 hover:border-gray-300 transition-all duration-300 rounded-lg overflow-hidden">
      {certification.certificateImageUrl && (
        <div className="aspect-video overflow-hidden bg-gray-50">
          <img
            src={certification.certificateImageUrl || "/placeholder.svg"}
            alt={certification.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="font-medium text-base tracking-tight">
          {certification.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Issued by {certification.issuer}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center bg-gray-100 px-2 py-1 text-xs text-gray-700 rounded">
            <Calendar className="w-3 h-3 mr-1" />
            Issued: {formatDate(certification.issueDate)}
          </span>
          {certification.expirationDate && (
            <span className="inline-flex items-center bg-gray-100 px-2 py-1 text-xs text-gray-700 rounded">
              <Calendar className="w-3 h-3 mr-1" />
              Expires: {formatDate(certification.expirationDate)}
            </span>
          )}
        </div>

        {certification.certificateUrl && (
          <a
            href={certification.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-black text-sm group-hover:underline"
          >
            Show credential
            <ExternalLink className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
};

const CertificationSectionViewable = ({
  userData,
}: CertificationSectionProps) => {
  const certifications = userData?.certifications || [];

  return (
    <section className="bg-white shadow-sm border border-gray-100 p-6 md:p-8 transform transition-all duration-300 hover:shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center uppercase tracking-wider">
          <Award className="w-5 h-5 mr-3 text-gray-400" />
          Certifications
        </h2>
        <button className="text-black hover:bg-gray-100 p-2 transition-colors rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {certifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <CertificationItem key={cert._id} certification={cert} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-50 p-6 mb-4">
            <Award className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-light">
            No certifications listed yet
          </p>
          <button className="mt-4 text-black border-b border-black hover:border-transparent transition-colors text-sm font-medium">
            Add certification
          </button>
        </div>
      )}
    </section>
  );
};

export default CertificationSectionViewable;
