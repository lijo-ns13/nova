import React from "react";
import ApplicantCard from "./ApplicantCard";
import { Application } from "../services/applicantService";

interface ApplicantListProps {
  applications: Application[];
  onStatusChange: (
    id: string,
    status: "applied" | "shortlisted" | "rejected",
    reason?: string
  ) => void;
}

const ApplicantList: React.FC<ApplicantListProps> = ({
  applications,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicantCard
          key={application._id}
          applicant={application}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ApplicantList;
