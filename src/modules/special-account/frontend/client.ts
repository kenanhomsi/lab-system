import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { SpecialAccountClient } from "../abstraction";
import type {
  AccountStatement,
  CreateExpenseInput,
  CreatePaymentInput,
  CreateTaskInput,
  DailyTask,
  LookupItem,
  PatchTaskInput,
  SpecialExpense,
  SpecialPayment,
} from "../abstraction/schemas";
import { endpoint } from "./endpoint";

const appendQuery = (path: string, query?: Record<string, string | undefined>) => {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends SpecialAccountClient<AxiosState> {
  async listPayments(query?: { from?: string; to?: string }) {
    const res = await super
      .sharedGet({ endpoint: appendQuery(endpoint.payments, query) })
      .perform<SpecialPayment[]>();
    return res.data;
  }

  async createPayment(body: CreatePaymentInput) {
    const res = await super
      .sharedPost({ endpoint: endpoint.payments, body })
      .perform<SpecialPayment>();
    return res.data;
  }

  async listExpenses(query?: { from?: string; to?: string }) {
    const res = await super
      .sharedGet({ endpoint: appendQuery(endpoint.expenses, query) })
      .perform<SpecialExpense[]>();
    return res.data;
  }

  async createExpense(body: CreateExpenseInput) {
    const res = await super
      .sharedPost({ endpoint: endpoint.expenses, body })
      .perform<SpecialExpense>();
    return res.data;
  }

  async getStatement(query?: { from?: string; to?: string }) {
    const res = await super
      .sharedGet({ endpoint: appendQuery(endpoint.statement, query) })
      .perform<AccountStatement>();
    return res.data;
  }

  async listTasks() {
    const res = await super
      .sharedGet({ endpoint: endpoint.tasks })
      .perform<DailyTask[]>();
    return res.data;
  }

  async createTask(body: CreateTaskInput) {
    const res = await super
      .sharedPost({ endpoint: endpoint.tasks, body })
      .perform<DailyTask>();
    return res.data;
  }

  async patchTask(id: string, body: PatchTaskInput) {
    const res = await super
      .sharedPatch({ endpoint: endpoint.taskById(id), body })
      .perform<DailyTask>();
    return res.data;
  }

  async deleteTask(id: string) {
    await super.sharedDelete({ endpoint: endpoint.taskById(id) }).perform();
  }

  async listDescriptions() {
    const res = await super
      .sharedGet({ endpoint: endpoint.lookupDescriptions })
      .perform<{ items: LookupItem[] }>();
    return res.data.items ?? res.data;
  }

  async listExpenseTypes() {
    const res = await super
      .sharedGet({ endpoint: endpoint.lookupExpenseTypes })
      .perform<{ items: LookupItem[] }>();
    return res.data.items ?? res.data;
  }
}

export { Client as SpecialAccountFrontendClient };
