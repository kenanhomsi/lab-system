"use client";
import { Api } from "./api";
import { Init } from "./init";
import { State } from "./state";
import { UI } from "./ui";
import { FactoryProps } from "./types";
const Factory = (props: FactoryProps) => <Init {...props}><State><Api><UI /></Api></State></Init>;
export { Factory };
