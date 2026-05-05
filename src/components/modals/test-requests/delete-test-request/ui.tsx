"use client";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMirror } from "./store";
const UI = () => { const props=useMirror("props") as {opened?:boolean;onClose?:()=>void;testRequest?:{id:number;medicalTestNameEn?:string}|null}; const submitAction=useMirror("submitAction") as (id:string)=>Promise<unknown>; const onClose=props.onClose||(()=>{}); return <Modal opened={Boolean(props.opened)} onClose={onClose} title="Delete Test Request" centered><Stack><Text>Are you sure you want to delete {props.testRequest?.medicalTestNameEn||"this request"}?</Text><Group justify="flex-end"><Button variant="default" onClick={onClose}>Cancel</Button><Button color="red" onClick={async()=>{if(props.testRequest?.id){await submitAction(String(props.testRequest.id));onClose();}}}>Delete</Button></Group></Stack></Modal>;};
export { UI };
