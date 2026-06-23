import { injectable, injectFromBase } from "inversify";
import { toIso8601Utc } from "@/lib/dates/to-iso-8601";
import { AxiosState } from "@/modules/axios";
import { BannerClient } from "../abstraction";
import { normalizePublicBannerPayload } from "@/lib/banners/public-banner-payload";
import { endpoint } from "./endpoint";
import type { BannerItem } from "@/types/banner";
import {
  CreateBannerParams,
  DeleteBannerParams,
  FindAllBannerParams,
  FindAllPublicBannerParams,
  UpdateBannerParams,
} from "./types";

type PublicBannerResponse = BannerItem[] | Record<string, unknown>;

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

@injectable()@injectFromBase({ extendProperties: true })
class Client extends BannerClient<AxiosState> {
  async findAll(params: FindAllBannerParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<{
        data: BannerItem[];
        total: number;
        page: number;
        pageSize: number;
      }>();
    return res;
  }

  async findAllPublic(params: FindAllPublicBannerParams) {
    const res = await super
      .sharedFindAllPublic({
        endpoint: appendQueryParams(endpoint.findAllPublic, {
          location: params.location,
        }),
      })
      .perform<PublicBannerResponse>();
    return normalizePublicBannerPayload(res.data);
  }

  async create(params: CreateBannerParams) {
    const formData = new FormData();
    formData.append("title", params.title);
    formData.append("type", params.type);
    formData.append("InternalLink", params.InternalLink);
    formData.append("ExternalLink", params.ExternalLink);
    formData.append("TargetType", params.TargetType);
    formData.append("Location", params.Location);
    if (params.DisplayOrder !== undefined)
      formData.append("DisplayOrder", params.DisplayOrder.toString());
    formData.append("Media", params.Media);
    formData.append("startDate", toIso8601Utc(params.startDate));
    formData.append("endDate", toIso8601Utc(params.endDate));
    formData.append("isActive", String(params.isActive));
    if (params.VisibilityRulesJson)
      formData.append("VisibilityRulesJson", params.VisibilityRulesJson);

    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        formData,
      })
      .perform<BannerItem>();
    return res.data;
  }

  async update(params: UpdateBannerParams) {
    const formData = new FormData();
    formData.append("Title", params.title);
    formData.append("Type", params.type);
    formData.append("InternalLink", params.InternalLink);
    formData.append("ExternalLink", params.ExternalLink);
    formData.append("TargetType", params.TargetType);
    formData.append("Location", params.Location);
    formData.append("DisplayOrder", params.DisplayOrder.toString());
    formData.append("StartDate", toIso8601Utc(params.startDate));
    formData.append("EndDate", toIso8601Utc(params.endDate));
    formData.append("IsActive", String(params.isActive));
    if (params.VisibilityRulesJson) {
      formData.append("VisibilityRulesJson", params.VisibilityRulesJson);
    }
    if (params.Media) {
      formData.append("Media", params.Media);
    }

    const res = await super
      .sharedPutFormData({
        endpoint: endpoint.update(params.id),
        formData,
      })
      .perform<BannerItem>();
    return res.data;
  }

  async delete(params: DeleteBannerParams) {
    await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .perform<unknown>();
  }
}

export { Client as BannerFrontendClient };
