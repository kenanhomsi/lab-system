import { inject, injectable } from "inversify";
import { specialAccountModuleNames } from "../names";
import { SpecialAccountBackendClient } from "./client";
import {
  CreateExpenseParams,
  CreatePaymentParams,
  CreateTaskParams,
  DateRangeQuery,
  DeleteTaskParams,
  PatchTaskParams,
  WithToken,
} from "./types";

@injectable()
class Service {
  @inject(specialAccountModuleNames.client)
  private Client: SpecialAccountBackendClient;

  listPayments(params: DateRangeQuery) {
    return this.Client.listPayments(params);
  }

  createPayment(params: CreatePaymentParams) {
    return this.Client.createPayment(params);
  }

  listExpenses(params: DateRangeQuery) {
    return this.Client.listExpenses(params);
  }

  createExpense(params: CreateExpenseParams) {
    return this.Client.createExpense(params);
  }

  getStatement(params: DateRangeQuery) {
    return this.Client.getStatement(params);
  }

  listTasks(params: WithToken) {
    return this.Client.listTasks(params);
  }

  createTask(params: CreateTaskParams) {
    return this.Client.createTask(params);
  }

  patchTask(params: PatchTaskParams) {
    return this.Client.patchTask(params);
  }

  deleteTask(params: DeleteTaskParams) {
    return this.Client.deleteTask(params);
  }

  listDescriptions(params: WithToken) {
    return this.Client.listDescriptions(params);
  }

  listExpenseTypes(params: WithToken) {
    return this.Client.listExpenseTypes(params);
  }
}

export { Service as SpecialAccountBackendService };
