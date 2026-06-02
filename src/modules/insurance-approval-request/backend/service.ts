import { inject, injectable } from "inversify";
import { insuranceApprovalRequestModuleNames } from "../names";
import { InsuranceApprovalRequestBackendClient } from "./client";
import {
  CreateInsuranceApprovalParams,
  FindAllInsuranceApprovalParams,
  FindMineInsuranceApprovalParams,
  FindOneInsuranceApprovalParams,
  RemoveInsuranceApprovalParams,
  UpdateInsuranceApprovalStatusParams,
} from "./types";

@injectable()
class Service {
  @inject(insuranceApprovalRequestModuleNames.client)
  private Client: InsuranceApprovalRequestBackendClient;

  async findAll(params: FindAllInsuranceApprovalParams) {
    return this.Client.findAll(params);
  }

  async findMine(params: FindMineInsuranceApprovalParams) {
    return this.Client.findMine(params);
  }

  async findMineOne(params: FindOneInsuranceApprovalParams) {
    return this.Client.findMineOne(params);
  }

  async findOne(params: FindOneInsuranceApprovalParams) {
    return this.Client.findOne(params);
  }

  async create(params: CreateInsuranceApprovalParams) {
    return this.Client.create(params);
  }

  async updateStatus(params: UpdateInsuranceApprovalStatusParams) {
    return this.Client.updateStatus(params);
  }

  async remove(params: RemoveInsuranceApprovalParams) {
    return this.Client.remove(params);
  }
}

export { Service as InsuranceApprovalRequestBackendService };
