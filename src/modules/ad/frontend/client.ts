import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { AdClient } from "../abstraction";
import { endpoint } from "./endpoint";
import type { AdItem } from "@/types/ad";
import type {
  CreateAdParams,
  DeleteAdParams,
  FindAllAdParams,
  FindOneAdParams,
  UpdateAdParams,
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

const toAdFormData = (params: CreateAdParams | UpdateAdParams) => {
  const formData = new FormData();
  formData.append("Name", params.name);
  formData.append("Description", params.description);
  formData.append("MediaType", params.mediaType);
  formData.append("AddressName", params.addressName);
  if (params.media) {
    formData.append("Media", params.media);
  }
  return formData;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AdClient<AxiosState> {
  async findAll(params: FindAllAdParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.findAll, params.query) })
      .perform<unknown>();
    return res.data;
  }

  async findAllPublic() {
    const res = await super.sharedGet({ endpoint: endpoint.findAllPublic }).perform<unknown>();
    return res.data;
  }

  async findOne(params: FindOneAdParams) {
    const res = await super.sharedGet({ endpoint: endpoint.findOne(params.id) }).perform<unknown>();
    return res.data as AdItem;
  }

  async create(params: CreateAdParams) {
    const res = await super
      .sharedPostFormData({ endpoint: endpoint.create, formData: toAdFormData(params) })
      .perform<unknown>();
    return res.data as AdItem;
  }

  async update(params: UpdateAdParams) {
    const res = await super
      .sharedPatchFormData({
        endpoint: endpoint.update(params.id),
        formData: toAdFormData(params),
      })
      .perform<unknown>();
    return res.data as AdItem;
  }

  async delete(params: DeleteAdParams) {
    await super.sharedDelete({ endpoint: endpoint.remove(params.id) }).perform<unknown>();
  }
}

export { Client as AdFrontendClient };
