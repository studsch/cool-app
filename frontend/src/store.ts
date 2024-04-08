import { any, boolean, number } from "zod";
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
  isLoading: boolean;
  hasMore: boolean;
  totalPages: number;
  error: () => void;
  updateType: (type: string) => void;
  updateArgs: (args: string) => void;
  updatePage: (page: number) => void;
  updateSize: (size: number) => void;
  updateError: (error: () => void) => void;
  nextSearch: () => Promise<number>;
}

export const useSearch = create<SearchState>()(
  immer(set => ({
    searchs: [],
    page: 1,
    size: 10,
    type: "users",
    hasMore: false,
    args: "",
    isLoading: false,
    totalPages: 0,
    error: () => {},
    updateType: (type: string) => set({ type: type }),
    updateArgs: (args: string) => set({ args: args }),
    updatePage: (page: number) => set({ page: page }),
    updateSize: (size: number) => set({ size: size }),
    updateError: (error: () => void) => set({ error: error }),
    nextSearch: async () => {
      let type = "";
      let args = "";
      let error = () => {};
      set(state => {
        type = state.type;
        args = state.args;
        args = args + `&page=${state.page}&size=${state.size}`;
      });
      if (type == "users") {
        set({ isLoading: true });
        // await new Promise(r => setTimeout(r, 2000)); для теста кружка
        const res = await FetchUsers(args);
        set({
          isLoading: false,
        });
        if (res.error) {
          error();
          return 1;
        } else {
          set(state => {
            state.page == 1
              ? (state.searchs = res.users)
              : state.searchs.push(...res.users);
            state.totalPages = res.totalPages;
          });
        }
      } else {
      }
      return 0;
    },
  })),
);
