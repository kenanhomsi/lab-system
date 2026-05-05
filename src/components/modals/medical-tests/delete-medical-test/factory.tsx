"use client";

import { Api } from "./api";
import { Init } from "./init";
import { State } from "./state";
import { UI } from "./ui";
import { FactoryProps } from "./types";

const Factory = (props: FactoryProps) => {
    return (
        <Init opened={props.opened} onClose={props.onClose}>
            <State medicalTest={props.medicalTest}>
                <Api>
                    <UI />
                </Api>
            </State>
        </Init>
    );
};

export { Factory as DeleteMedicalTestModal };
