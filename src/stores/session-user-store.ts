"use client";

import { create } from "zustand";

/** Mirrors the fields test flows need from the JWT session (set on login / session sync). */
export type SessionUserSnapshot = {
  id: string;
  roles: string[];
  email?: string;
  fullName?: string;
};

type SessionUserState = {
  user: SessionUserSnapshot | null;
  setSessionUser: (user: SessionUserSnapshot | null) => void;
};

const useSessionUserStore = create<SessionUserState>((set) => ({
  user: null,
  setSessionUser: (user) => set({ user }),
}));

export { useSessionUserStore };
