import { inject, injectable } from "inversify";
import { complaintModuleNames } from "../names";
import { ComplaintFrontendClient } from "./client";
import {
  CreateComplaintMineParams,
  FindAllComplaintParams,
  UpdateComplaintStatusParams,
} from "./types";

@injectable()
class Service {
  @inject(complaintModuleNames.client)
  private Client: ComplaintFrontendClient;

  async findAll(params: FindAllComplaintParams) {
    return this.Client.findAll(params);
  }

  async updateStatus(params: UpdateComplaintStatusParams) {
    return this.Client.updateStatus(params);
  }

  async createMine(params: CreateComplaintMineParams) {
    return this.Client.createMine(params);
  }
}

export { Service as ComplaintFrontendService };
