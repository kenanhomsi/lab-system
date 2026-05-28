import Init from "./init";
import State from "./state";
import Observer from "./observer";
import Utils from "./utils";
import UI from "./ui";
import { fetchDashboardData } from "@/lib/api/fetch-dashboard";

export default async function Page() {
  let dashboard = null;

  try {
    dashboard = await fetchDashboardData();
  } catch {
    dashboard = null;
  }

  return (
    <Init dashboard={dashboard}>
      kenan
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
