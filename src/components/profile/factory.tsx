"use client";

import { Api } from "./apis";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Api>
        <Utils>
          <UI />
        </Utils>
      </Api>
    </State>
  );
};

export { Factory as ProfilePage };

