import { inject, injectable } from "inversify";
import { slideCardModuleNames } from "../names";
import { SlideCardFrontendClient } from "./client";
import {
  CreateSlideCardParams,
  FindAllPublicSlideCardParams,
  FindAllSlideCardParams,
  FindOneSlideCardParams,
} from "./types";

@injectable()
class Service {
  @inject(slideCardModuleNames.client)
  private Client: SlideCardFrontendClient;

  async findAll(params: FindAllSlideCardParams) {
    return this.Client.findAll(params);
  }

  async findAllPublic(params: FindAllPublicSlideCardParams = {}) {
    return this.Client.findAllPublic(params);
  }

  async findOne(params: FindOneSlideCardParams) {
    return this.Client.findOne(params);
  }

  async create(params: CreateSlideCardParams) {
    return this.Client.create(params);
  }
}

export { Service as SlideCardFrontendService };
