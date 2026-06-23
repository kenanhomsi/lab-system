import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
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

const toAdFormData = (params: CreateAdParams | UpdateAdParams) => {
  const formData = new FormData();
  formData.append("Name", params.name);
  formData.append("Description", params.description);
  formData.append("MediaType", params.mediaType);
  formData.append("AddressName", params.addressName);
  formData.append("Latitude", "0");
  formData.append("Longitude", "0");
  if (params.media) {
    formData.append("Media", params.media);
  }
  return formData;
};

const unwrapPayload = (payload: unknown): unknown => {
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
class Client extends AdClient<BackendState> {
  async Find(params: FindAllAdParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.findAll })
      .withAuth(params.token)
      .withQuery(params.query)
      .perform<unknown>();
    return unwrapPayload(res.data);
  }

  async FindPublic() {
    const res = await super.sharedGet({ endpoint: endpoint.findAllPublic }).perform<unknown>();
    return unwrapPayload(res.data);
  }

  async FindOne(params: FindOneAdParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapPayload(res.data) as AdItem;
  }

  async Create(params: CreateAdParams) {
    const res = await super
      .sharedPostFormData({ endpoint: endpoint.create, formData: toAdFormData(params) })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapPayload(res.data) as AdItem;
  }

  async Update(params: UpdateAdParams) {
    const res = await super
      .sharedPatchFormData({
        endpoint: endpoint.update(params.id),
        formData: toAdFormData(params),
      })
      .withAuth(params.token)
      .perform<unknown>();
    return unwrapPayload(res.data) as AdItem;
  }

  async Delete(params: DeleteAdParams) {
    await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
  }
}

export { Client as AdBackendClient };
