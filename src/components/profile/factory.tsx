"use client";

import { Api } from "./apis";
import { State } from "./state";
import { UI } from "./ui";
import type { ProfileTab } from "./store/state";
import { Utils } from "./utils";

type ProfilePageProps = {
  initialTab?: ProfileTab;
};

const Factory = ({ initialTab }: ProfilePageProps) => {
  return (
    <State initialTab={initialTab}>
      <Api>
        <Utils>
          <UI />
        </Utils>
      </Api>
    </State>
  );
};

export { Factory as ProfilePage };
