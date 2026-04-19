import State from "./state";
import Utils from "./utils";
import UI from "./ui";
import { Api } from "./api";
import { Navigator } from "@/components/navigator";
export default function LoginPage() {
  return (
    <State>
      <Navigator />
      <Api>
        <Utils>
          <UI />
        </Utils>
      </Api>
    </State>
  );
}
