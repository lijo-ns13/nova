import React from "react";
import ApplicantCard from "./ApplicantCard";
import { ApplicantListResponse } from "../types/applicant";

interface ApplicantListProps {
  applications: ApplicantListResponse[];
  onStatusChange: (
    id: string,
    status: "applied" | "shortlisted" | "rejected",
    reason?: string
  ) => Promise<void>; // Assume it's async to handle API without refresh
}

const ApplicantList: React.FC<ApplicantListProps> = ({
  applications,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicantCard
          key={application.applicationId}
          applicant={application}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ApplicantList;
