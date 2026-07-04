import { Suspense } from "react";
import State from "./state";
import Utils from "./utils";
import UI from "./ui";
import { Api } from "./api";
import { Navigator } from "@/components/navigator";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <State>
        <Navigator />
        <Api>
          <Utils>
            <UI />
          </Utils>
        </Api>
      </State>
    </Suspense>
  );
}
