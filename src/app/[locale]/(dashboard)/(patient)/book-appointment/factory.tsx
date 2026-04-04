"use client";

import { BookAppointmentApiProvider } from "./api";
import { BookAppointmentObserverProvider } from "./observer";
import { BookAppointmentStateProvider } from "./state";
import { BookAppointmentUtilsProvider } from "./utils";
import { BookAppointmentUIFactory } from "./ui/factory";

export function BookAppointmentFeatureFactory() {
  return (
    <BookAppointmentStateProvider>
      <BookAppointmentApiProvider>
        <BookAppointmentObserverProvider>
          <BookAppointmentUtilsProvider>
            <BookAppointmentUIFactory />
          </BookAppointmentUtilsProvider>
        </BookAppointmentObserverProvider>
      </BookAppointmentApiProvider>
    </BookAppointmentStateProvider>
  );
}
