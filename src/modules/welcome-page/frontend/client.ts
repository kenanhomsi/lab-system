import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { WelcomePageClient } from "../abstraction";
import { endpoint } from "./endpoint";
import type { WelcomePageItem } from "@/types/welcome-page";
import type {
  CreateWelcomePageParams,
  DeleteWelcomePageParams,
  FindAllWelcomePageParams,
  FindOneWelcomePageParams,
  UpdateWelcomePageParams,
} from "./types";

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

const unwrapPayload = (payload: unknown): unknown => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return unwrapPayload((payload as { data: unknown }).data);
  }
  return payload;
};

const normalizeRows = (payload: unknown): WelcomePageItem[] => {
  const unwrapped = unwrapPayload(payload);
  if (Array.isArray(unwrapped)) return unwrapped as WelcomePageItem[];
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    "items" in unwrapped &&
    Array.isArray((unwrapped as { items: unknown }).items)
  ) {
    return (unwrapped as { items: WelcomePageItem[] }).items;
  }
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    "results" in unwrapped &&
    Array.isArray((unwrapped as { results: unknown }).results)
  ) {
    return (unwrapped as { results: WelcomePageItem[] }).results;
  }
  return [];
};

const normalizeOne = (payload: unknown): WelcomePageItem => {
  return unwrapPayload(payload) as WelcomePageItem;
};

const toWelcomePageFormData = (
  params: CreateWelcomePageParams | UpdateWelcomePageParams,
) => {
  const formData = new FormData();
  formData.append("Name", params.name);
  formData.append("Description", params.description);
  formData.append("MediaType", params.mediaType);
  formData.append("IsActive", String(params.isActive));
  if (params.media) {
    formData.append("Media", params.media);
  }
  return formData;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends WelcomePageClient<AxiosState> {
  async findAll(params: FindAllWelcomePageParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<unknown>();
    return normalizeRows(res.data);
  }

  async findAllPublic() {
    const res = await super.sharedGet({ endpoint: endpoint.findAllPublic }).perform<unknown>();
    return normalizeRows(res.data);
  }

  async findOne(params: FindOneWelcomePageParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.findOne(params.id) })
      .perform<unknown>();
    return normalizeOne(res.data);
  }

  async create(params: CreateWelcomePageParams) {
    const res = await super
      .sharedPostFormData({
        endpoint: endpoint.create,
        formData: toWelcomePageFormData(params),
      })
      .perform<unknown>();
    return normalizeOne(res.data);
  }

  async update(params: UpdateWelcomePageParams) {
    const res = await super
      .sharedPatchFormData({
        endpoint: endpoint.update(params.id),
        formData: toWelcomePageFormData(params),
      })
      .perform<unknown>();
    return normalizeOne(res.data);
  }

  async delete(params: DeleteWelcomePageParams) {
    await super.sharedDelete({ endpoint: endpoint.remove(params.id) }).perform<unknown>();
  }
}

export { Client as WelcomePageFrontendClient };
