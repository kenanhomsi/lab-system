import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { PageClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  normalizeArrayPayload,
  normalizeObjectPayload,
} from "@/lib/website-pages/payload";
import type {
  PageDto,
  PageListItemDto,
  WebsiteNavigationPageDto,
  WebsitePageDto,
} from "@/types/website-page";
import type {
  CreatePageParams,
  DeletePageParams,
  FindAllPageParams,
  FindNavigationPagesParams,
  FindOnePageParams,
  FindPublicPageParams,
  UpdatePageParams,
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

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends PageClient<AxiosState> {
  async findAll(params: FindAllPageParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<unknown>();
    return normalizeArrayPayload<PageListItemDto>(res.data);
  }

  async findOne(params: FindOnePageParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.findOne(params.id) })
      .perform<unknown>();
    return normalizeObjectPayload<PageDto>(res.data);
  }

  async create(params: CreatePageParams) {
    const res = await super
      .sharedPostJson({ endpoint: endpoint.create, body: params })
      .perform<unknown>();
    return normalizeObjectPayload<PageDto>(res.data);
  }

  async update(params: UpdatePageParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPatchJson({ endpoint: endpoint.update(id), body })
      .perform<unknown>();
    return normalizeObjectPayload<PageDto>(res.data);
  }

  async delete(params: DeletePageParams) {
    await super.sharedDelete({ endpoint: endpoint.remove(params.id) }).perform<unknown>();
  }

  async findNavigation(params: FindNavigationPagesParams) {
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.navigation, {
          language: params.language,
        }),
      })
      .perform<unknown>();
    return normalizeArrayPayload<WebsiteNavigationPageDto>(res.data);
  }

  async findPublicPage(params: FindPublicPageParams) {
    const res = await super
      .sharedGet({
        endpoint: appendQueryParams(endpoint.publicPage(params.slug), {
          language: params.language,
        }),
      })
      .perform<unknown>();
    return normalizeObjectPayload<WebsitePageDto>(res.data);
  }
}

export { Client as PageFrontendClient };
