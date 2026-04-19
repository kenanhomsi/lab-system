import Init from "./init";
import State from "./state";
import Observer from "./observer";
import Utils from "./utils";
import UI from "./ui";
import {
  queue,
  recentAnalysis,
  stats,
  systemHealth,
  testDist,
  throughput,
} from "./mock-data";

export default function Page() {
  return (
    <Init
      stats={stats}
      queue={queue}
      throughput={throughput}
      testDist={testDist}
      recentAnalysis={recentAnalysis}
      systemHealth={systemHealth}
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
