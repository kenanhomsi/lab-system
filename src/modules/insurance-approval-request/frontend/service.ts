import { inject, injectable } from "inversify";
import { insuranceApprovalRequestModuleNames } from "../names";
import { InsuranceApprovalRequestFrontendClient } from "./client";
import {
  CreateInsuranceApprovalParams,
  FindAllInsuranceApprovalParams,
  FindMineInsuranceApprovalParams,
  UpdateInsuranceApprovalStatusParams,
} from "./types";

@injectable()
class Service {
  @inject(insuranceApprovalRequestModuleNames.client)
  private Client: InsuranceApprovalRequestFrontendClient;

  async findAll(params: FindAllInsuranceApprovalParams) {
    return this.Client.findAll(params);
  }

  async findMine(params: FindMineInsuranceApprovalParams) {
    return this.Client.findMine(params);
  }

  async findMineOne(id: string) {
    return this.Client.findMineOne(id);
  }

  async findOne(id: string) {
    return this.Client.findOne(id);
  }

  async create(params: CreateInsuranceApprovalParams) {
    return this.Client.create(params);
  }

  async updateStatus(params: UpdateInsuranceApprovalStatusParams) {
    return this.Client.updateStatus(params);
  }

  async remove(id: string) {
    return this.Client.remove(id);
  }
}

export { Service as InsuranceApprovalRequestFrontendService };
