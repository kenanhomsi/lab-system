import { inject, injectable } from "inversify";
import { specialAccountModuleNames } from "../names";
import { SpecialAccountFrontendClient } from "./client";
import type {
  CreateExpenseInput,
  CreatePaymentInput,
  CreateTaskInput,
  PatchTaskInput,
} from "../abstraction/schemas";

@injectable()
class Service {
  @inject(specialAccountModuleNames.client)
  private Client: SpecialAccountFrontendClient;

  listPayments(query?: { from?: string; to?: string }) {
    return this.Client.listPayments(query);
  }

  createPayment(body: CreatePaymentInput) {
    return this.Client.createPayment(body);
  }

  listExpenses(query?: { from?: string; to?: string }) {
    return this.Client.listExpenses(query);
  }

  createExpense(body: CreateExpenseInput) {
    return this.Client.createExpense(body);
  }

  getStatement(query?: { from?: string; to?: string }) {
    return this.Client.getStatement(query);
  }

  listTasks() {
    return this.Client.listTasks();
  }

  createTask(body: CreateTaskInput) {
    return this.Client.createTask(body);
  }

  patchTask(id: string, body: PatchTaskInput) {
    return this.Client.patchTask(id, body);
  }

  deleteTask(id: string) {
    return this.Client.deleteTask(id);
  }

  listDescriptions() {
    return this.Client.listDescriptions();
  }

  listExpenseTypes() {
    return this.Client.listExpenseTypes();
  }
}

export { Service as SpecialAccountFrontendService };
