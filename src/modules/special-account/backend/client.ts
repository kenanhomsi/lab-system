import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  MOCK_DESCRIPTION_LOOKUP,
  MOCK_EXPENSE_TYPE_LOOKUP,
  mockSpecialExpensesCreate,
  mockSpecialExpensesList,
  mockSpecialPaymentsCreate,
  mockSpecialPaymentsList,
  mockSpecialStatement,
  mockSpecialTasksCreate,
  mockSpecialTasksDelete,
  mockSpecialTasksList,
  mockSpecialTasksUpdate,
} from "@/lib/api/special-mock-store";
import { SpecialAccountClient } from "../abstraction";
import type {
  AccountStatement,
  DailyTask,
  LookupItem,
  SpecialExpense,
  SpecialPayment,
} from "../abstraction/schemas";
import { endpoint } from "./endpoint";
import {
  CreateExpenseParams,
  CreatePaymentParams,
  CreateTaskParams,
  DateRangeQuery,
  DeleteTaskParams,
  PatchTaskParams,
  WithToken,
} from "./types";

const appendQuery = (path: string, query?: Record<string, string | undefined>) => {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

const unwrapResponse = <T>(response: unknown): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as { data: T }).data;
  }
  return response as T;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends SpecialAccountClient<BackendState> {
  async listPayments(params: DateRangeQuery): Promise<SpecialPayment[]> {
    const { token, query } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialPaymentsList(query?.from, query?.to);
    }
    const res = await super
      .sharedGet({ endpoint: appendQuery(endpoint.payments, query) })
      .withAuth(token)
      .perform<SpecialPayment[]>();
    return unwrapResponse<SpecialPayment[]>(res.data);
  }

  async createPayment(params: CreatePaymentParams): Promise<SpecialPayment> {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialPaymentsCreate(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.payments, body })
      .withAuth(token)
      .perform<SpecialPayment>();
    return unwrapResponse<SpecialPayment>(res.data);
  }

  async listExpenses(params: DateRangeQuery): Promise<SpecialExpense[]> {
    const { token, query } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialExpensesList(query?.from, query?.to);
    }
    const res = await super
      .sharedGet({ endpoint: appendQuery(endpoint.expenses, query) })
      .withAuth(token)
      .perform<SpecialExpense[]>();
    return unwrapResponse<SpecialExpense[]>(res.data);
  }

  async createExpense(params: CreateExpenseParams): Promise<SpecialExpense> {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialExpensesCreate(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.expenses, body })
      .withAuth(token)
      .perform<SpecialExpense>();
    return unwrapResponse<SpecialExpense>(res.data);
  }

  async getStatement(params: DateRangeQuery): Promise<AccountStatement> {
    const { token, query } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialStatement(query?.from, query?.to);
    }
    const res = await super
      .sharedGet({ endpoint: appendQuery(endpoint.statement, query) })
      .withAuth(token)
      .perform<AccountStatement>();
    return unwrapResponse<AccountStatement>(res.data);
  }

  async listTasks(params: WithToken): Promise<DailyTask[]> {
    const { token } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialTasksList();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.tasks })
      .withAuth(token)
      .perform<DailyTask[]>();
    return unwrapResponse<DailyTask[]>(res.data);
  }

  async createTask(params: CreateTaskParams): Promise<DailyTask> {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockSpecialTasksCreate(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.tasks, body })
      .withAuth(token)
      .perform<DailyTask>();
    return unwrapResponse<DailyTask>(res.data);
  }

  async patchTask(params: PatchTaskParams): Promise<DailyTask> {
    const { token, id, body } = params;
    if (!isUpstreamBackendReady()) {
      const updated = mockSpecialTasksUpdate(id, body);
      if (!updated) throw new Error("Task not found");
      return updated;
    }
    const res = await super
      .sharedPatch({ endpoint: endpoint.taskById(id), body })
      .withAuth(token)
      .perform<DailyTask>();
    return unwrapResponse<DailyTask>(res.data);
  }

  async deleteTask(params: DeleteTaskParams): Promise<void> {
    const { token, id } = params;
    if (!isUpstreamBackendReady()) {
      if (!mockSpecialTasksDelete(id)) throw new Error("Task not found");
      return;
    }
    await super.sharedDelete({ endpoint: endpoint.taskById(id) }).withAuth(token).perform();
  }

  async listDescriptions(params: WithToken): Promise<LookupItem[]> {
    const { token } = params;
    if (!isUpstreamBackendReady()) {
      return MOCK_DESCRIPTION_LOOKUP;
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.lookupDescriptions })
      .withAuth(token)
      .perform<{ items: LookupItem[] }>();
    return unwrapResponse<{ items: LookupItem[] }>(res.data).items ?? [];
  }

  async listExpenseTypes(params: WithToken): Promise<LookupItem[]> {
    const { token } = params;
    if (!isUpstreamBackendReady()) {
      return MOCK_EXPENSE_TYPE_LOOKUP;
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.lookupExpenseTypes })
      .withAuth(token)
      .perform<{ items: LookupItem[] }>();
    return unwrapResponse<{ items: LookupItem[] }>(res.data).items ?? [];
  }
}

export { Client as SpecialAccountBackendClient };
