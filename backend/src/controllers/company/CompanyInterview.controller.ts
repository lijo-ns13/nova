import { Request, Response } from "express";
import mongoose from "mongoose";
import applicationModal from "../../models/application.modal";
import { Interview } from "../../models/interview.modal";
import { ApplicationStatus } from "../../models/job.modal";

// Company schedules interview
export const createInterview = async (req: Request, res: Response) => {
  const { companyId, userId, applicationId, scheduledAt } = req.body;

  const existingInterview = await Interview.findOne({
    companyId,
    scheduledAt: new Date(scheduledAt),
  });

  if (existingInterview) {
    return res.status(400).json({
      message: "Conflict: Company already has an interview at this time.",
    });
  }

  const roomId = new mongoose.Types.ObjectId().toString();

  const interview = await Interview.create({
    companyId,
    userId,
    applicationId,
    scheduledAt,
    roomId,
  });

  await applicationModal.findByIdAndUpdate(applicationId, {
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
  });

  const io = req.app.get("io");
  io?.to(userId).emit("interview-scheduled", {
    roomId,
    scheduledAt,
    interviewId: interview._id,
  });

  res.status(201).json(interview);
};

// Company marks result
export const markInterviewResult = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result } = req.body;

  if (!["pass", "fail"].includes(result)) {
    return res.status(400).json({ message: "Invalid result" });
  }

  const interview = await Interview.findByIdAndUpdate(
    id,
    { result },
    { new: true }
  );
  if (!interview)
    return res.status(404).json({ message: "Interview not found" });

  const appStatus =
    result === "pass"
      ? ApplicationStatus.INTERVIEW_PASSED
      : ApplicationStatus.INTERVIEW_FAILED;

  await applicationModal.findByIdAndUpdate(interview.applicationId, {
    status: appStatus,
  });

  const io = req.app.get("io");
  io?.to(interview.userId.toString()).emit("interview-result", interview);

  res.json(interview);
};

// Company views interviews
export const getCompanyInterviews = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const interviews = await Interview.find({ companyId }).populate(
    "userId applicationId"
  );
  res.json(interviews);
};
