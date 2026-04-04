"use client";

import type { Offer } from "./store/api";
import { OffersApiProvider } from "./api";
import { OffersObserverProvider } from "./observer";
import { OffersStateProvider } from "./state";
import { OffersUtilsProvider } from "./utils";
import { OffersUIFactory } from "./ui/factory";

export function OffersFeatureFactory(props: {
  offers: Offer[];
  locale: string;
}) {
  return (
    <OffersStateProvider offers={props.offers} locale={props.locale}>
      <OffersApiProvider>
        <OffersObserverProvider>
          <OffersUtilsProvider>
            <OffersUIFactory />
          </OffersUtilsProvider>
        </OffersObserverProvider>
      </OffersApiProvider>
    </OffersStateProvider>
  );
}
