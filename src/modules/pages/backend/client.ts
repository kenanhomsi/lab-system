import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
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

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends PageClient<BackendState> {
  async Find(params: FindAllPageParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.findAll })
      .withAuth(params.token)
      .withQuery(params.query)
      .perform<unknown>();
    return normalizeArrayPayload<PageListItemDto>(res.data);
  }

  async FindOne(params: FindOnePageParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return normalizeObjectPayload<PageDto>(res.data);
  }

  async Create(params: CreatePageParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedPostJson({ endpoint: endpoint.create, body })
      .withAuth(token)
      .perform<unknown>();
    return normalizeObjectPayload<PageDto>(res.data);
  }

  async Update(params: UpdatePageParams) {
    const { token, id, ...body } = params;
    const res = await super
      .sharedPatchJson({ endpoint: endpoint.update(id), body })
      .withAuth(token)
      .perform<unknown>();
    return normalizeObjectPayload<PageDto>(res.data);
  }

  async Delete(params: DeletePageParams) {
    await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
  }

  async FindNavigation(params: FindNavigationPagesParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.navigation })
      .withQuery({ language: params.language })
      .perform<unknown>();
    return normalizeArrayPayload<WebsiteNavigationPageDto>(res.data);
  }

  async FindPublicPage(params: FindPublicPageParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.publicPage(params.slug) })
      .withQuery({ language: params.language })
      .perform<unknown>();
    return normalizeObjectPayload<WebsitePageDto>(res.data);
  }
}

export { Client as PageBackendClient };
