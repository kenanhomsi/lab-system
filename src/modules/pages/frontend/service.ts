import { inject, injectable } from "inversify";
import { pageModuleNames } from "../names";
import { PageFrontendClient } from "./client";
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
  private Client: PageFrontendClient;

  async findAll(params: FindAllPageParams) {
    return this.Client.findAll(params);
  }

  async findOne(params: FindOnePageParams) {
    return this.Client.findOne(params);
  }

  async create(params: CreatePageParams) {
    return this.Client.create(params);
  }

  async update(params: UpdatePageParams) {
    return this.Client.update(params);
  }

  async delete(params: DeletePageParams) {
    return this.Client.delete(params);
  }

  async findNavigation(params: FindNavigationPagesParams) {
    return this.Client.findNavigation(params);
  }

  async findPublicPage(params: FindPublicPageParams) {
    return this.Client.findPublicPage(params);
  }
}

export { Service as PageFrontendService };
