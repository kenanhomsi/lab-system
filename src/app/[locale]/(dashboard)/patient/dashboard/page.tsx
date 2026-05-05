import Init from "./init";
import State from "./state";
import Observer from "./observer";
import Utils from "./utils";
import UI from "./ui";
import { activity, healthSummary, recentResults, stats } from "./mock-data";

export default function Page() {
  return (
    <Init
      stats={stats}
      recentResults={recentResults}
      healthSummary={healthSummary}
      activity={activity}
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
