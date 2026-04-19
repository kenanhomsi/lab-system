import { inject, injectable } from "inversify";
import { complaintModuleNames } from "../names";
import { ComplaintBackendClient } from "./client";
import { FindAllComplaintParams, UpdateComplaintStatusParams } from "./types";

@injectable()
class Service {
  @inject(complaintModuleNames.client)
  private Client: ComplaintBackendClient;

  async findAll(params: FindAllComplaintParams) {
    return this.Client.findAll(params);
  }

  async updateStatus(params: UpdateComplaintStatusParams) {
    return this.Client.updateStatus(params);
  }
}

export { Service as ComplaintBackendService };
