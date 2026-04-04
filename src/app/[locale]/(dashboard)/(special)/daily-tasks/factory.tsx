"use client";

import { DailyTasksApiProvider } from "./api";
import { DailyTasksObserverProvider } from "./observer";
import { DailyTasksStateProvider } from "./state";
import { DailyTasksUtilsProvider } from "./utils";
import { DailyTasksUIFactory } from "./ui/factory";

export function DailyTasksFeatureFactory() {
  return (
    <DailyTasksStateProvider>
      <DailyTasksApiProvider>
        <DailyTasksObserverProvider>
          <DailyTasksUtilsProvider>
            <DailyTasksUIFactory />
          </DailyTasksUtilsProvider>
        </DailyTasksObserverProvider>
      </DailyTasksApiProvider>
    </DailyTasksStateProvider>
  );
}
