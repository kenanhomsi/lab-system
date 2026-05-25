import { inject, injectable } from "inversify";
import { bannerModuleNames } from "../names";
import { BannerFrontendClient } from "./client";
import {
  CreateBannerParams,
  DeleteBannerParams,
  FindAllBannerParams,
  FindAllPublicBannerParams,
} from "./types";

@injectable()
class Service {
  @inject(bannerModuleNames.client)
  private Client: BannerFrontendClient;

  async findAll(params: FindAllBannerParams) {
    return this.Client.findAll(params);
  }

  async findAllPublic(params: FindAllPublicBannerParams) {
    return this.Client.findAllPublic(params);
  }

  async create(params: CreateBannerParams) {
    return this.Client.create(params);
  }

  async delete(params: DeleteBannerParams) {
    return this.Client.delete(params);
  }
}

export { Service as BannerFrontendService };
