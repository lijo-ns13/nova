import { useEffect, useState } from "react";
import AddCertificateModal from "./Forms/AddCertificateModal";
import {
  getCertificates,
  deleteCertificate,
} from "../../services/ProfileService";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { SecureCloudinaryImage } from "../../../../components/SecureCloudinaryImage";
import toast from "react-hot-toast";
import { CertificateResponseDTO } from "../../dto/certificateResponse.dto";
import ConfirmDialog from "../../../../components/ConfirmDiolog";
import EditCertificateModal from "./Forms/EditCertficateModal";

function CertificateSection() {
  const [certificates, setCertificates] = useState<CertificateResponseDTO[]>(
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIsModalOpen, setEditIsModalOpen] = useState(false);
  const [editCertificate, setEditCertificate] =
    useState<CertificateResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    try {
      setIsLoading(true);
      const res = await getCertificates(id);
      setCertificates(res);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCertificateAdded = () => {
    setIsModalOpen(false);
    setEditCertificate(null);
    fetchCertificates();
  };

  const handleEdit = (certificate: CertificateResponseDTO) => {
    setEditCertificate(certificate);
    setEditIsModalOpen(true);
  };

  const handleDeleteClick = (projectId: string) => {
    setSelectedCertificateId(projectId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCertificateId) return;

    setIsDeleting(true);

    try {
      await deleteCertificate(id, selectedCertificateId);
      setCertificates((prev) =>
        prev.filter((p) => p.id !== selectedCertificateId)
      );
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedCertificateId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Certifications
            </h2>
            <p className="text-gray-600 mt-1">
              Showcase your professional qualifications and achievements
            </p>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            onClick={() => {
              setEditCertificate(null);
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
            Add Certificate
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert: CertificateResponseDTO) => (
              <div
                key={cert.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-gray-700 font-medium">{cert.issuer}</p>
                    </div>
                    {cert.certificateImageUrl && (
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={cert.certificateImageUrl}
                          alt={`${cert.title} certificate`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
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
                      Issued: {formatDate(cert.issueDate)}
                    </div>
                    {cert.expirationDate && (
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Expires: {formatDate(cert.expirationDate)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    {cert.certificateImageUrl && (
                      <a
                        href={cert.certificateImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View Credential
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cert)}
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
                      onClick={() => handleDeleteClick(cert.id)}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No certifications added yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Add your professional certifications to showcase your
              qualifications and achievements.
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
              Add Your First Certificate
            </button>
          </div>
        )}

        <AddCertificateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditCertificate(null);
          }}
          onCertificateAdded={handleCertificateAdded}
        />
        {editCertificate && (
          <EditCertificateModal
            isOpen={editIsModalOpen}
            onClose={() => setEditIsModalOpen(false)}
            onCertificateUpdated={handleCertificateAdded}
            certificate={editCertificate}
          />
        )}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete Certificate?"
          description="Are you sure you want to delete this Certificate? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsConfirmOpen(false);
            setSelectedCertificateId(null);
          }}
        />
      </div>
    </div>
  );
}

export default CertificateSection;
