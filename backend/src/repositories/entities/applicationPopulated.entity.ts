import { IApplication } from "./application.entity";
import { IJob } from "./job.entity";
import { IUser } from "./user.entity";

export interface IApplicationPopulatedJob extends Omit<IApplication, "job"> {
  job: Pick<IJob, "_id" | "title" | "description" | "location" | "jobType">;
}
export interface IApplicationPopulatedUserAndJob
  extends Omit<IApplication, "user" | "job"> {
  user: Pick<IUser, "_id" | "name" | "username" | "profilePicture">;
  job: Pick<IJob, "_id" | "title" | "company">;
}
