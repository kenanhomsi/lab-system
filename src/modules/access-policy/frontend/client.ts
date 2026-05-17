import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import type { AccessPolicyDto } from "../abstraction";
import { AccessPolicyClient } from "../abstraction/client";
import { endpoint } from "./endpoint";
import {
  CreateAccessPolicyFrontendParams,
  DeleteAccessPolicyFrontendParams,
  DisableAccessPolicyFrontendParams,
  EnableAccessPolicyFrontendParams,
  FindAllAccessPolicyFrontendParams,
  FindOneAccessPolicyFrontendParams,
  UpdateAccessPolicyFrontendParams,
  ValidateAccessPolicyFrontendParams,
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

function normalizeListPayload(body: unknown): AccessPolicyDto[] {
  if (Array.isArray(body)) {
    return body as AccessPolicyDto[];
  }
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    Array.isArray((body as { data: unknown }).data)
  ) {
    return (body as { data: AccessPolicyDto[] }).data;
  }
  return [];
}

function writeBody(p: CreateAccessPolicyFrontendParams): Record<string, unknown> {
  const { resource, action, effect, subjectType, subjectKey, condition, priority, isEnabled, description } =
    p;
  const payload: Record<string, unknown> = {
    resource,
    action,
    effect,
    subjectType,
    subjectKey,
    priority,
    isEnabled,
    description,
  };
  if (condition !== undefined) {
    payload.condition = condition;
  }
  return payload;
}

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AccessPolicyClient<AxiosState> {
  async findAll(params: FindAllAccessPolicyFrontendParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .perform<unknown>();
    return normalizeListPayload(res.data);
  }

  async create(params: CreateAccessPolicyFrontendParams) {
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        body: writeBody(params),
      })
      .perform<AccessPolicyDto>();
    return res.data;
  }

  async findOne(params: FindOneAccessPolicyFrontendParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .perform<AccessPolicyDto>();
    return res.data;
  }

  async update(params: UpdateAccessPolicyFrontendParams) {
    const { id, ...payload } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        body: writeBody(payload),
      })
      .perform<AccessPolicyDto>();
    return res.data;
  }

  async delete(params: DeleteAccessPolicyFrontendParams) {
    const res = await super.sharedDelete({ endpoint: endpoint.remove(params.id) }).perform<unknown>();
    return res.data;
  }

  async enable(params: EnableAccessPolicyFrontendParams) {
    const res = await super.sharedPatch({ endpoint: endpoint.enable(params.id) }).perform<unknown>();
    return res.data;
  }

  async disable(params: DisableAccessPolicyFrontendParams) {
    const res = await super.sharedPatch({ endpoint: endpoint.disable(params.id) }).perform<unknown>();
    return res.data;
  }

  async validate(params: ValidateAccessPolicyFrontendParams) {
    const res = await super
      .sharedPostValidate({
        endpoint: endpoint.validate,
        body: writeBody(params),
      })
      .perform<unknown>();
    return res.data;
  }
}

export { Client as AccessPolicyFrontendClient };
