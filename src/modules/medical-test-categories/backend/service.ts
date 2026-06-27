import { inject, injectable } from "inversify";
import { medicalTestCategoryModuleNames } from "../names";
import { MedicalTestCategoryBackendClient } from "./client";
import type {
  CreateMedicalTestCategoryParams,
  DeleteMedicalTestCategoryParams,
  GetMedicalTestCategoryParams,
  ListMedicalTestCategoriesParams,
  UpdateMedicalTestCategoryParams,
} from "./types";

@injectable()
class Service {
  @inject(medicalTestCategoryModuleNames.client)
  private Client: MedicalTestCategoryBackendClient;

  list(params: ListMedicalTestCategoriesParams) {
    return this.Client.list(params);
  }

  listAll(params: { token: string }) {
    return this.Client.listAll(params);
  }

  create(params: CreateMedicalTestCategoryParams) {
    return this.Client.create(params);
  }

  get(params: GetMedicalTestCategoryParams) {
    return this.Client.get(params);
  }

  update(params: UpdateMedicalTestCategoryParams) {
    return this.Client.update(params);
  }

  delete(params: DeleteMedicalTestCategoryParams) {
    return this.Client.delete(params);
  }
}

export { Service as MedicalTestCategoryBackendService };
