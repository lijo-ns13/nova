import { useState, useEffect } from "react";
import BaseModal from "../modals/BaseModal";
import {
  addCertificate,
  editCertificate,
  deleteCertificate,
} from "../../services/ProfileService";

interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  certificateUrl: string;
  certificateImageUrl: string;
  description?: string;
}

interface CertificateSectionProps {
  userId: string;
  initialCertificates: Certificate[];
}

function CertificateSection({
  userId,
  initialCertificates,
}: CertificateSectionProps) {
  const [certificates, setCertificates] =
    useState<Certificate[]>(initialCertificates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] =
    useState<Certificate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setCurrentCertificate({
      title: "",
      issuer: "",
      issueDate: "",
      expirationDate: "",
      certificateUrl: "",
      certificateImageUrl: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (certificate: Certificate) => {
    setCurrentCertificate(certificate);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (certificateId: string) => {
    try {
      await deleteCertificate(userId, certificateId);
      setCertificates((certs) => certs.filter((c) => c._id !== certificateId));
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCertificate) return;

    try {
      let response;
      const formattedData = {
        ...currentCertificate,
        issueDate: new Date(currentCertificate.issueDate).toISOString(),
        expirationDate: currentCertificate.expirationDate
          ? new Date(currentCertificate.expirationDate).toISOString()
          : null,
      };

      if (isEditing && currentCertificate._id) {
        response = await editCertificate(currentCertificate._id, formattedData);
        const updatedCert = {
          ...response,
          issueDate: currentCertificate.issueDate,
          expirationDate: currentCertificate.expirationDate,
        };
        setCertificates((certs) =>
          certs.map((cert) =>
            cert._id === updatedCert._id ? updatedCert : cert
          )
        );
      } else {
        response = await addCertificate(userId, formattedData);
        const newCert = {
          ...response,
          issueDate: currentCertificate.issueDate,
          expirationDate: currentCertificate.expirationDate,
        };
        setCertificates((certs) => [...certs, newCert]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save certificate:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* ... existing JSX structure ... */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Certificates</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New
        </button>
      </div>
      {certificates.map((certificate, index) => (
        <div key={certificate._id || index}>
          <div className="flex justify-between items-start">
            {/* ... existing certificate details ... */}
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(certificate)}>Edit</button>
              <button
                onClick={() => certificate._id && handleDelete(certificate._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Edit Certificate" : "Add New Certificate"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ... existing form fields ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              value={currentCertificate?.title || ""}
              onChange={(e) =>
                setCurrentCertificate((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuer*
            </label>
            <input
              type="text"
              value={currentCertificate?.issuer || ""}
              onChange={(e) =>
                setCurrentCertificate((prev) =>
                  prev ? { ...prev, issuer: e.target.value } : null
                )
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date*
              </label>
              <input
                type="date"
                value={currentCertificate?.issueDate || ""}
                onChange={(e) =>
                  setCurrentCertificate((prev) =>
                    prev ? { ...prev, issueDate: e.target.value } : null
                  )
                }
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={currentCertificate?.expirationDate || ""}
                onChange={(e) =>
                  setCurrentCertificate((prev) =>
                    prev ? { ...prev, expirationDate: e.target.value } : null
                  )
                }
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate URL
            </label>
            <input
              type="url"
              value={currentCertificate?.certificateUrl || ""}
              onChange={(e) =>
                setCurrentCertificate((prev) =>
                  prev ? { ...prev, certificateUrl: e.target.value } : null
                )
              }
              className="w-full border rounded p-2"
              placeholder="https://example.com/certificate"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit">
              {isEditing ? "Update" : "Add"} Certificate
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}

export default CertificateSection;
