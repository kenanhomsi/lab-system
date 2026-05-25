import Observer from "./observer";
import UI from "./ui";
import State from "./state";
import Utils from "./utils";
import Init from "./init";
import { sideBarItem } from "./type";

const Factory = ({ items }: { items: sideBarItem[] }) => {
    return (
        <Init items={items}>
            <State items={items}>
                <Observer>
                    <Utils>
                        <UI />
                    </Utils>
                </Observer>
            </State>
        </Init>
    )
};

export default Factory;