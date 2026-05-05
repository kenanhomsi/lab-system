import { injectable, injectFromBase } from "inversify";
import { toIso8601Utc } from "@/lib/dates/to-iso-8601";
import { AxiosState } from "@/modules/axios";
import { BannerClient } from "../abstraction";
import { endpoint } from "./endpoint";
import type { BannerItem } from "@/types/banner";
import {
  CreateBannerParams,
  FindAllBannerParams,
  FindAllPublicBannerParams,
} from "./types";

type PublicBannerResponse = BannerItem[] | {
  success?: boolean;
  message?: string;
  data?: BannerItem[];
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

const normalizePublicBanners = (response: PublicBannerResponse): BannerItem[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  return [];
};

@injectable()
@injectFromBase({ extendProperties: true })
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
    return normalizePublicBanners(res.data);
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
}

export { Client as BannerFrontendClient };
