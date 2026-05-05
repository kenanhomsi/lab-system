import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
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
  if (data && typeof data === "object" && Array.isArray(data.data))
    return data.data;
  return [];
};

const normalizeAdminSlideCard = (
  response: AdminSlideCardResponse,
): SlideCardItem => {
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

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends SlideCardClient<BackendState> {
  async findAll(params: FindAllSlideCardParams) {
    const { token, query } = params;
    const res = await super
      .sharedFindAll({ endpoint: endpoint.findAll })
      .withAuth(token)
      .withQuery(query)
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
      .withAuth(params.token)
      .perform<AdminSlideCardResponse>();
    return normalizeAdminSlideCard(res.data);
  }

  async create(params: CreateSlideCardParams) {
    const backendBase = process.env.BACKEND_URL?.replace(/\/$/, "");
    if (!backendBase) {
      throw new Error("BACKEND_URL is not configured");
    }

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

    const res = await fetch(`${backendBase}${endpoint.create}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${params.token}` },
      body: formData,
    });

    const text = await res.text();
    if (!res.ok) {
      let message = text.trim() || `Backend error (${res.status})`;
      try {
        const errBody = JSON.parse(text) as {
          error?: string;
          message?: string;
        };
        const candidate = errBody?.error ?? errBody?.message;
        if (typeof candidate === "string" && candidate.trim()) {
          message = candidate;
        }
      } catch {
        // keep plain-text message from upstream
      }
      throw new Error(message);
    }

    const payload = parseJsonOrThrow<unknown>(text, res.status);
    return normalizeAdminSlideCard(payload as AdminSlideCardResponse);
  }
}

export { Client as SlideCardBackendClient };
