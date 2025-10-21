// src/store/useNotificationStore.ts
import { create } from "zustand";
import { IEvento, IRecado } from "@/components/Lists/types";

interface NotificationStore {
  loading: boolean;
  count: number;
  eventos: IEvento[];
  recados: IRecado[];
  setCount: (count: number) => void;
  setEventos: (updater: IEvento[] | ((prev: IEvento[]) => IEvento[])) => void;
  setRecados: (updater: IRecado[] | ((prev: IRecado[]) => IRecado[])) => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  loading: false,
  count: 0,
  eventos: [],
  recados: [],
  setCount: (count) => set({ count }),
  setEventos: (updater) =>
    set((state) => ({
      eventos: typeof updater === "function" ? updater(state.eventos) : updater,
    })),
  setRecados: (updater) =>
    set((state) => ({
      recados: typeof updater === "function" ? updater(state.recados) : updater,
    })),
  setLoading: (loading) => set({ loading }),
}));
