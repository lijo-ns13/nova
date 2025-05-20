import { Request, Response } from "express";
import mongoose from "mongoose";
import applicationModal from "../../models/application.modal";
import { Interview } from "../../models/interview.modal";
import { ApplicationStatus } from "../../models/job.modal";
import { v4 as uuidv4 } from "uuid";

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

  const roomId = uuidv4();

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

// Company views interviews
export const getCompanyInterviews = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const interviews = await Interview.find({ companyId }).populate(
    "userId applicationId"
  );
  res.json(interviews);
};
