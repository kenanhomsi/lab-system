"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForBanners } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
    return (
        <State>
            <Observer>
                <Api>
                    <Modals />
                    <SchemaForBanners>
                        <Utils>
                            <UI />
                        </Utils>
                    </SchemaForBanners>
                </Api>
            </Observer>
        </State>
    );
};

export { Factory as BannersTable };
