import Init from "./init";
import State from "./state";
import Observer from "./observer";
import Utils from "./utils";
import UI from "./ui";
import { pendingReferrals, recentPatients, stats, weeklySummary } from "./mock-data";

export default function Page() {
  return (
    <Init
      stats={stats}
      pendingReferrals={pendingReferrals}
      recentPatients={recentPatients}
      weeklySummary={weeklySummary}
    >
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
