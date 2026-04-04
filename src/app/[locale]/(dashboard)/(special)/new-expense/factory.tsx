"use client";

import { NewExpenseApiProvider } from "./api";
import { NewExpenseObserverProvider } from "./observer";
import { NewExpenseStateProvider } from "./state";
import { NewExpenseUtilsProvider } from "./utils";
import { NewExpenseUIFactory } from "./ui/factory";

export function NewExpenseFeatureFactory() {
  return (
    <NewExpenseStateProvider>
      <NewExpenseApiProvider>
        <NewExpenseObserverProvider>
          <NewExpenseUtilsProvider>
            <NewExpenseUIFactory />
          </NewExpenseUtilsProvider>
        </NewExpenseObserverProvider>
      </NewExpenseApiProvider>
    </NewExpenseStateProvider>
  );
}
