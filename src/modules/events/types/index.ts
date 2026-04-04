import type {
  ProjectCreatedPayload,
  ProjectDeletedPayload,
} from "./projects";

export interface IEvents {
  projectCreated: ProjectCreatedPayload;
  projectDeleted: ProjectDeletedPayload;
}

export type EventName = keyof IEvents;

export type EventPayload<K extends EventName> = IEvents[K];
