import { inject, injectable } from "inversify";
import { pageModuleNames } from "../names";
import { PageBackendClient } from "./client";
import type {
  CreatePageParams,
  DeletePageParams,
  FindAllPageParams,
  FindNavigationPagesParams,
  FindOnePageParams,
  FindPublicPageParams,
  UpdatePageParams,
} from "./types";

@injectable()
class Service {
  @inject(pageModuleNames.client)
  private Client: PageBackendClient;

  async findAll(params: FindAllPageParams) {
    return this.Client.Find(params);
  }

  async findOne(params: FindOnePageParams) {
    return this.Client.FindOne(params);
  }

  async create(params: CreatePageParams) {
    return this.Client.Create(params);
  }

  async update(params: UpdatePageParams) {
    return this.Client.Update(params);
  }

  async delete(params: DeletePageParams) {
    return this.Client.Delete(params);
  }

  async findNavigation(params: FindNavigationPagesParams) {
    return this.Client.FindNavigation(params);
  }

  async findPublicPage(params: FindPublicPageParams) {
    return this.Client.FindPublicPage(params);
  }
}

export { Service as PageBackendService };
