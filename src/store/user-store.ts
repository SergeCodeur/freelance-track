import { Session } from "next-auth";
import { create } from "zustand";

interface UserState {
  user: Session["user"] | null;
  setUser: (user: Session["user"] | null) => void;
  updateUser: (data: Partial<Session["user"]>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
