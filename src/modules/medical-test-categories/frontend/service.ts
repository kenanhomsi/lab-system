import { inject, injectable } from "inversify";
import { medicalTestCategoryModuleNames } from "../names";
import { MedicalTestCategoryFrontendClient } from "./client";
import type {
  GetMedicalTestCategoryParams,
  ListMedicalTestCategoriesParams,
  UpdateMedicalTestCategoryParams,
} from "./types";
import type { UpsertMedicalTestCategoryInput } from "../abstraction";

@injectable()
class Service {
  @inject(medicalTestCategoryModuleNames.client)
  private Client: MedicalTestCategoryFrontendClient;

  list(params?: ListMedicalTestCategoriesParams) {
    return this.Client.list(params);
  }

  listAll() {
    return this.Client.listAll();
  }

  create(body: UpsertMedicalTestCategoryInput) {
    return this.Client.create(body);
  }

  get(params: GetMedicalTestCategoryParams) {
    return this.Client.get(params);
  }

  update(params: UpdateMedicalTestCategoryParams) {
    return this.Client.update(params);
  }

  delete(id: number) {
    return this.Client.delete(id);
  }
}

export { Service as MedicalTestCategoryFrontendService };
