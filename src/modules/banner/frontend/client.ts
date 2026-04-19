import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { BannerClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  CreateBannerParams,
  DeleteBannerParams,
  FindAllBannerParams,
  FindOneBannerParams,
  UpdateBannerParams,
} from "./types";

type BannerItem = {
  id: string;
  title: string;
  subtitle?: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageUrl?: string;
};

type BannerListResponse = {
  data: BannerItem[];
  total: number;
  page: number;
  pageSize: number;
};

const appendQueryParams = (
  path: string,
  query?: Record<string, string | undefined>,
) => {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends BannerClient<AxiosState> {
  async findAll(params: FindAllBannerParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<BannerListResponse>();
    return res.data;
  }

  async create(params: CreateBannerParams) {
    const formData = new FormData();
    formData.append("title", params.title);
    if (params.subtitle) formData.append("subtitle", params.subtitle);
    formData.append("targetUrl", params.targetUrl);
    formData.append("startDate", params.startDate);
    formData.append("endDate", params.endDate);
    formData.append("isActive", String(params.isActive));
    if (params.imageFile) formData.append("image", params.imageFile);

    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        formData,
      })
      .perform<BannerItem>();
    return res.data;
  }

  async findOne(params: FindOneBannerParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<BannerItem>();
    return res.data;
  }

  async update(params: UpdateBannerParams) {
    const { id, ...body } = params;
    const formData = new FormData();
    formData.append("title", body.title);
    if (body.subtitle) formData.append("subtitle", body.subtitle);
    formData.append("targetUrl", body.targetUrl);
    formData.append("startDate", body.startDate);
    formData.append("endDate", body.endDate);
    formData.append("isActive", String(body.isActive));
    if (body.imageFile) formData.append("image", body.imageFile);

    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        formData,
      })
      .perform<BannerItem>();
    return res.data;
  }

  async delete(params: DeleteBannerParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .perform<{ success: boolean }>();
    return res.data;
  }
}

export { Client as BannerFrontendClient };
