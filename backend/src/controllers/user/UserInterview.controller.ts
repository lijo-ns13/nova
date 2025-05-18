import { Request, Response } from "express";
import mongoose from "mongoose";
import { Interview } from "../../models/interview.modal";
import applicationModal from "../../models/application.modal";
import { ApplicationStatus } from "../../models/job.modal";

// User accepts/rejects
export const updateInterviewStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const interview = await Interview.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!interview)
    return res.status(404).json({ message: "Interview not found" });

  const appStatus =
    status === "accepted"
      ? ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER
      : ApplicationStatus.INTERVIEW_REJECTED_BY_USER;

  await applicationModal.findByIdAndUpdate(interview.applicationId, {
    status: appStatus,
  });

  const io = req.app.get("io");
  io?.to(interview.companyId.toString()).emit(
    "interview-status-updated",
    interview
  );

  res.json(interview);
};

// User views interviews
export const getUserInterviews = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const interviews = await Interview.find({ userId }).populate(
    "companyId applicationId"
  );
  res.json(interviews);
};
