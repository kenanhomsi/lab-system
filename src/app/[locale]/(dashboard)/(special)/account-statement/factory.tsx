"use client";

import { AccountStatementApiProvider } from "./api";
import { AccountStatementObserverProvider } from "./observer";
import { AccountStatementStateProvider } from "./state";
import { AccountStatementUtilsProvider } from "./utils";
import { AccountStatementUIFactory } from "./ui/factory";

export function AccountStatementFeatureFactory() {
  return (
    <AccountStatementStateProvider>
      <AccountStatementApiProvider>
        <AccountStatementObserverProvider>
          <AccountStatementUtilsProvider>
            <AccountStatementUIFactory />
          </AccountStatementUtilsProvider>
        </AccountStatementObserverProvider>
      </AccountStatementApiProvider>
    </AccountStatementStateProvider>
  );
}
