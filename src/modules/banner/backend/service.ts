import { inject, injectable } from "inversify";
import { bannerModuleNames } from "../names";
import { BannerBackendClient } from "./client";
import {
  CreateBannerParams,
  FindAllBannerParams,
  FindAllPublicBannerParams,
} from "./types";

@injectable()
class Service {
  @inject(bannerModuleNames.client)
  private Client: BannerBackendClient;

  async findAll(params: FindAllBannerParams) {
    return this.Client.Find(params);
  }

  async findAllPublic(params: FindAllPublicBannerParams) {
    return this.Client.FindPublic(params);
  }

  async create(params: CreateBannerParams) {
    return this.Client.Create(params);
  }
}

export { Service as BannerBackendService };
