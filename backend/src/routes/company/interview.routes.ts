import { Router } from "express";
import { inject, injectable } from "inversify";
import { INTERVIEW_TYPES } from "./interview.types";
import { InterviewController } from "./interview.controller";

@injectable()
export class InterviewRouter {
  public router: Router;

  constructor(
    @inject(INTERVIEW_TYPES.Controller) private controller: InterviewController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      this.controller.scheduleInterview.bind(this.controller)
    );
    this.router.put(
      "/:id/result",
      this.controller.markInterviewResult.bind(this.controller)
    );
    this.router.get(
      "/company/:companyId",
      this.controller.getCompanyInterviews.bind(this.controller)
    );
  }
}
