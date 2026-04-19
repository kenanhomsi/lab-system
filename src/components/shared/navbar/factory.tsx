import Observer from "./observer";
import UI from "./ui";
import State from "./state";
import Utils from "./utils";
import Init from "./init";
import { navbarConfig } from "./type";

const Factory = ({ config }: { config: navbarConfig }) => {
  return (
    <Init config={config}>
      <State>
        <Observer>
          <Utils>
            <UI />
          </Utils>
        </Observer>
      </State>
    </Init>
  );
};

export default Factory;
