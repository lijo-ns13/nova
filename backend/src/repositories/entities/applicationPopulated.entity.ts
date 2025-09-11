import { IJob } from "../../models/job.modal";
import { IApplication } from "./application.entity";

export interface IApplicationPopulatedJob extends Omit<IApplication, "job"> {
  job: Pick<IJob, "_id" | "title" | "description" | "location" | "jobType">;
}
