"use client";

import { ContactUsApiProvider } from "./api";
import { ContactUsObserverProvider } from "./observer";
import { ContactUsStateProvider } from "./state";
import { ContactUsUtilsProvider } from "./utils";
import { ContactUsUIFactory } from "./ui/factory";

export function ContactUsFeatureFactory() {
  return (
    <ContactUsStateProvider>
      <ContactUsApiProvider>
        <ContactUsObserverProvider>
          <ContactUsUtilsProvider>
            <ContactUsUIFactory />
          </ContactUsUtilsProvider>
        </ContactUsObserverProvider>
      </ContactUsApiProvider>
    </ContactUsStateProvider>
  );
}
