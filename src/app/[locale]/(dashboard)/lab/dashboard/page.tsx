import Init from "./init";
import State from "./state";
import Observer from "./observer";
import Utils from "./utils";
import UI from "./ui";
import { fetchDashboardData } from "@/lib/api/fetch-dashboard";
import { fetchPublicSlideCards } from "@/lib/api/fetch-public-slide-cards";
import type { SlideCardItem } from "@/types/slide-card";

export default async function Page() {
  let dashboard = null;
  let slideCards: SlideCardItem[] = [];

  try {
    [dashboard, slideCards] = await Promise.all([
      fetchDashboardData(),
      fetchPublicSlideCards(),
    ]);
  } catch {
    dashboard = null;
    slideCards = [];
  }

  return (
    <Init dashboard={dashboard} slideCards={slideCards}>
      <State>
        <Observer>
          <Utils>
            <UI />
          </Utils>
        </Observer>
      </State>
    </Init>
  );
}
