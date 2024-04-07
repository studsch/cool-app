import { any, number } from "zod";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import FetchUsers from "./fetch/search";

// для подтверждения по телефону через firebase

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

import { persist, devtools } from "zustand/middleware";
import SearchUser from "./components/search-users/search-user";
import { stat } from "fs";

interface ConfirmState {
  login: string;
  number: string;
  confirmResult?: ConfirmationResult;
  startTime: any;
  updateNumber: (number: string) => void;
  updateLogin: (login: string) => void;
  updateConfirmResult: (confirmResult: any) => void;
  updateStartTime: (startTime: any) => void;
}

export const useConfirmCode = create<ConfirmState>()(
  persist(
    devtools(set => ({
      number: "",
      confirmResult: undefined,
      startTime: null,
      login: "",
      updateNumber: number => set({ number: number }),
      updateConfirmResult: confirmResult =>
        set({ confirmResult: confirmResult }),
      updateStartTime: startTime => set({ startTime: startTime }),
      updateLogin: login => set({ login: login }),
    })),
    { name: "confirmStore", version: 1 },
  ),
);

interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "any";
  birthday: string;
}

interface SearchState {
  searchs: SearchUser[];
  page: number;
  size: number;
  type: string;
  args: string;
  hasMore: boolean;
  error: () => void;
  updateType: (type: string) => void;
  updateArgs: (args: string) => void;
  updateError: (error: () => void) => void;
  nextSearch: () => void;
  resetSearch: () => void;
}

export const useSearch = create<SearchState>()(
  immer(set => ({
    searchs: [],
    page: 1,
    size: 10,
    type: "users",
    hasMore: false,
    args: "",
    error: () => {},
    updateType: (type: string) => set({ type: type }),
    updateArgs: (args: string) => set({ args: args }),
    updateError: (error: () => void) => set({ error: error }),
    nextSearch: async () => {
      let type = "";
      let args = "";
      let error = () => {};
      set(state => {
        type = state.type;
        args = state.args;
        error = state.error;
      });
      if (type == "users") {
        const res = await FetchUsers(args);
        const users = res.users as SearchUser[];
        const totalPages = res.totalPages;
        if (res.error) {
          error();
        } else {
          set(state => {
            state.searchs = [...state.searchs, ...users];
            state.hasMore = res.hasMore;
            if (state.page < totalPages) {
              state.page = res.page + 1;
            }
          });
        }
      } else {
      }
    },
    resetSearch: () => {
      console.log("hehe");
      set({ searchs: [], page: 1, size: 10 });
    },
  })),
);
