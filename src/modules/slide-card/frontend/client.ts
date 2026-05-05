import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { SlideCardClient } from "../abstraction";
import { endpoint } from "./endpoint";
import type { SlideCardItem } from "@/types/slide-card";
import {
  CreateSlideCardParams,
  FindAllPublicSlideCardParams,
  FindAllSlideCardParams,
  FindOneSlideCardParams,
} from "./types";

type PublicSlideCardResponse =
  | SlideCardItem[]
  | {
      success?: boolean;
      message?: string;
      data?: SlideCardItem[];
    };

type AdminSlideCardsResponse =
  | SlideCardItem[]
  | {
      success?: boolean;
      message?: string;
      data?: SlideCardItem[] | { data?: SlideCardItem[] };
    };

type AdminSlideCardResponse =
  | SlideCardItem
  | {
      success?: boolean;
      message?: string;
      data?: SlideCardItem | { data?: SlideCardItem };
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

const normalizePublicSlideCards = (
  response: PublicSlideCardResponse,
): SlideCardItem[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  return [];
};

const normalizeAdminSlideCards = (
  response: AdminSlideCardsResponse,
): SlideCardItem[] => {
  if (Array.isArray(response)) return response;
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data;
  return [];
};

const normalizeAdminSlideCard = (response: AdminSlideCardResponse): SlideCardItem => {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data?: unknown }).data;
    if (data && typeof data === "object" && "data" in data) {
      return (data as { data: SlideCardItem }).data;
    }
    if (data && typeof data === "object") {
      return data as SlideCardItem;
    }
  }
  return response as SlideCardItem;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends SlideCardClient<AxiosState> {
  async findAll(params: FindAllSlideCardParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<AdminSlideCardsResponse>();
    return normalizeAdminSlideCards(res.data);
  }

  async findAllPublic(params: FindAllPublicSlideCardParams) {
    void params;

    const res = await super
      .sharedFindAllPublic({ endpoint: endpoint.findAllPublic })
      .perform<PublicSlideCardResponse>();
    return normalizePublicSlideCards(res.data);
  }

  async findOne(params: FindOneSlideCardParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<AdminSlideCardResponse>();
    return normalizeAdminSlideCard(res.data);
  }

  async create(params: CreateSlideCardParams) {
    const formData = new FormData();
    formData.append("Title", params.title);
    formData.append("Description", params.description);
    formData.append("Price", String(params.price));
    formData.append("Discount", String(params.discount));
    formData.append("ExpiryDate", params.expiryDate);
    formData.append("Badge", params.badge);
    formData.append("DetailPageLink", params.detailPageLink);
    formData.append("DisplayOrder", String(params.displayOrder));
    formData.append("IsActive", String(params.isActive));
    formData.append("Image", params.image);

    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        formData,
      })
      .perform<AdminSlideCardResponse>();
    return normalizeAdminSlideCard(res.data);
  }
}

export { Client as SlideCardFrontendClient };
