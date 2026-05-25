import { injectable, injectFromBase } from "inversify";
import { toIso8601Utc } from "@/lib/dates/to-iso-8601";
import { BackendState } from "@/modules/axios";
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

type GetAllResponseType = {
  success: boolean;
  message: string;
  data: {
    data: BannerItem[];
    total: number;
    page: number;
    pageSize: number;
  };
};

type PublicBannerResponse = BannerItem[] | Record<string, unknown>;
/** Multipart to the upstream API: names match OpenAPI (PascalCase). */
const toUpstreamBannerFormData = (params: CreateBannerParams) => {
  const formData = new FormData();
  formData.append("Title", params.title);
  formData.append("Type", params.type);
  formData.append("InternalLink", params.InternalLink);
  formData.append("ExternalLink", params.ExternalLink);
  formData.append("TargetType", params.TargetType);
  formData.append("Location", params.Location);
  if (params.DisplayOrder !== undefined) {
    formData.append("DisplayOrder", params.DisplayOrder.toString());
  }
  formData.append("Media", params.Media);
  formData.append("StartDate", toIso8601Utc(params.startDate));
  formData.append("EndDate", toIso8601Utc(params.endDate));
  formData.append("IsActive", String(params.isActive));
  if (params.VisibilityRulesJson) {
    formData.append("VisibilityRulesJson", params.VisibilityRulesJson);
  }
  return formData;
};

const parseJsonOrThrow = <T>(text: string, status: number): T => {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(`Backend error (${status})`);
  }
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new Error(trimmed);
  }
};

const unwrapBannerPayload = (payload: unknown): unknown => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return (payload as { data: unknown }).data;
  }
  return payload;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends BannerClient<BackendState> {
  async Find(params: FindAllBannerParams) {
    const { token, query } = params;
    const res = await super
      .sharedFindAll({ endpoint: endpoint.findAll })
      .withAuth(token)
      .withQuery(query)
      .perform<GetAllResponseType>();

    return res.data.data;
  }

  async FindPublic(params: FindAllPublicBannerParams) {
    const res = await super
      .sharedFindAllPublic({ endpoint: endpoint.findAllPublic })
      .withQuery(params.location ? { location: params.location } : undefined)
      .perform<PublicBannerResponse>();
    return normalizePublicBannerPayload(res.data);
  }

  async Create(params: CreateBannerParams) {
    const { token } = params;
    const backendBase = process.env.BACKEND_URL?.replace(/\/$/, "");
    if (!backendBase) {
      throw new Error("BACKEND_URL is not configured");
    }

    const formData = toUpstreamBannerFormData(params);
    const res = await fetch(`${backendBase}${endpoint.create}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const text = await res.text();

    if (!res.ok) {
      let message = text.trim() || `Backend error (${res.status})`;
      try {
        const errBody = JSON.parse(text) as { error?: string };
        if (typeof errBody?.error === "string") {
          message = errBody.error;
        }
      } catch {
        // keep plain-text message from upstream
      }
      throw new Error(message);
    }

    const payload = parseJsonOrThrow<unknown>(text, res.status);
    if (
      typeof payload === "object" &&
      payload !== null &&
      "data" in payload &&
      typeof (payload as { data: unknown }).data === "object" &&
      (payload as { data: BannerItem }).data !== null
    ) {
      return (payload as { data: BannerItem }).data;
    }

    return payload as BannerItem;
  }

  async Update(params: UpdateBannerParams) {
    const { token, id, body } = params;
    const ep = endpoint.update(id);
    if (body instanceof FormData) {
      const res = await super
        .sharedPutFormData({ endpoint: ep, formData: body })
        .withAuth(token)
        .perform<unknown>();
      return unwrapBannerPayload(res.data) as BannerItem;
    }
    const res = await super
      .sharedPutJson({ endpoint: ep, body })
      .withAuth(token)
      .perform<unknown>();
    return unwrapBannerPayload(res.data) as BannerItem;
  }

  async Delete(params: DeleteBannerParams) {
    await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
  }
}
export { Client as BannerBackendClient };
