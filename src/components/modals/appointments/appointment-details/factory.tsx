/**
 * Appointment Details Modal Factory
 * Composes the appointment details modal layers
 */

"use client";

import { Api } from "./api";
import { Init } from "./init";
import { State } from "./state";
import { UI } from "./ui";
import type { FactoryProps } from "./types";

const Factory = (props: FactoryProps) => {
    return (
        <Init {...props}>
            <State>
                <Api>
                    <UI />
                </Api>
            </State>
        </Init>
    );
};

export default Factory;
