import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import type { AccessPolicyDto, AccessPolicyWritePayload } from "../abstraction";
import { AccessPolicyClient } from "../abstraction/client";
import { endpoint } from "./endpoint";
import {
  CreateAccessPolicyParams,
  DeleteAccessPolicyParams,
  DisableAccessPolicyParams,
  EnableAccessPolicyParams,
  FindAllAccessPolicyParams,
  FindOneAccessPolicyParams,
  UpdateAccessPolicyParams,
  ValidateAccessPolicyParams,
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

function writeBodyFromPayload(payload: AccessPolicyWritePayload): Record<string, unknown> {
  const {
    resource,
    action,
    effect,
    subjectType,
    subjectKey,
    condition,
    priority,
    isEnabled,
    description,
  } = payload;
  const body: Record<string, unknown> = {
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
    body.condition = condition;
  }
  return body;
}

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends AccessPolicyClient<BackendState> {
  async findAll(params: FindAllAccessPolicyParams) {
    const res = await super
      .sharedFindAll({
        endpoint: appendQueryParams(endpoint.findAll, params.query),
      })
      .withAuth(params.token)
      .perform<unknown>();
    return normalizeListPayload(res.data);
  }

  async create(params: CreateAccessPolicyParams) {
    const { token, ...rest } = params;
    const res = await super
      .sharedCreate({
        endpoint: endpoint.create,
        body: writeBodyFromPayload(rest),
      })
      .withAuth(token)
      .perform<AccessPolicyDto>();
    return res.data;
  }

  async findOne(params: FindOneAccessPolicyParams) {
    const res = await super
      .sharedFindOne({ endpoint: endpoint.findOne(params.id) })
      .withAuth(params.token)
      .perform<AccessPolicyDto>();
    return res.data;
  }

  async update(params: UpdateAccessPolicyParams) {
    const { id, token, ...rest } = params;
    const res = await super
      .sharedUpdate({
        endpoint: endpoint.update(id),
        body: writeBodyFromPayload(rest),
      })
      .withAuth(token)
      .perform<AccessPolicyDto>();
    return res.data;
  }

  async delete(params: DeleteAccessPolicyParams) {
    const res = await super
      .sharedDelete({ endpoint: endpoint.remove(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return res.data;
  }

  async enable(params: EnableAccessPolicyParams) {
    const res = await super
      .sharedPatch({ endpoint: endpoint.enable(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return res.data;
  }

  async disable(params: DisableAccessPolicyParams) {
    const res = await super
      .sharedPatch({ endpoint: endpoint.disable(params.id) })
      .withAuth(params.token)
      .perform<unknown>();
    return res.data;
  }

  async validate(params: ValidateAccessPolicyParams) {
    const { token, ...rest } = params;
    const res = await super
      .sharedPostValidate({
        endpoint: endpoint.validate,
        body: writeBodyFromPayload(rest),
      })
      .withAuth(token)
      .perform<unknown>();
    return res.data;
  }
}

export { Client as AccessPolicyBackendClient };
