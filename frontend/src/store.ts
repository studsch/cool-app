import { any, boolean, number } from "zod";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FetchUsers, FetchPosts } from "./fetch/search";
import { FetchFriends, FetchWhoToFollow } from "./fetch/friends";
import {
  RenewWrapper,
  RenewToken,
  tokenUpdateStateGlobal,
} from "./fetch/token";
import { FetchFavorites } from "./fetch/favorites";
import { FetchReplyComments } from "./fetch/comment";

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

interface ConfirmStateRecovery {
  number: string;
  confirmResult?: ConfirmationResult;
  startTime: any;
  updateNumber: (number: string) => void;
  updateConfirmResult: (confirmResult: any) => void;
  updateStartTime: (startTime: any) => void;
}

export const useConfirmCodeRecovery = create<ConfirmStateRecovery>()(
  persist(
    devtools(set => ({
      number: "",
      confirmResult: undefined,
      startTime: null,
      updateNumber: number => set({ number: number }),
      updateConfirmResult: confirmResult =>
        set({ confirmResult: confirmResult }),
      updateStartTime: startTime => set({ startTime: startTime }),
    })),
    { name: "confirmStoreRecovery", version: 1 },
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
  updateSearchs: (searchs: []) => void;
  updatePage: (page: number) => void;
  updateSize: (size: number) => void;
  updateError: (error: () => void) => void;
  nextSearch: (
    token: string,
    refreshToken: string,
    userId: string,
    update: Function,
  ) => Promise<number>;
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
    updateSearchs: (searchs: []) => set({ searchs: searchs }),
    updateArgs: (args: string) => set({ args: args }),
    updatePage: (page: number) => set({ page: page }),
    updateSize: (size: number) => set({ size: size }),
    updateError: (error: () => void) => set({ error: error }),
    nextSearch: async (
      token: string,
      refreshToken: string,
      userId: string,
      update: Function,
    ) => {
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
        const res = await RenewWrapper(
          FetchUsers,
          [args, token],
          RenewToken,
          [userId, refreshToken],
          update,
          tokenUpdateStateGlobal,
        );
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
        // await new Promise(r => setTimeout(r, 2000)); для теста кружка
        set({ isLoading: true });
        const res = await RenewWrapper(
          FetchPosts,
          [args, token],
          RenewToken,
          [userId, refreshToken],
          update,
          tokenUpdateStateGlobal,
        );
        if (res.error) {
          error();
          return 1;
        } else {
          set(state => {
            state.page == 1
              ? (state.searchs = res.posts)
              : state.searchs.push(...res.posts);
            state.totalPages = res.totalPages;
          });
        }
      }
      set({ isLoading: false });
      return 0;
    },
  })),
);

interface MyContactsState {
  contacts: any[] | null;
  GetContacts: (
    token: string,
    refreshToken: string,
    userId: string,
    update: Function,
  ) => void;
  updateContacts: (contacts: any[] | null) => void;
  isLoading: boolean;
  updateLoading: (isLoading: boolean) => void;
}

export const useMyContacts = create<MyContactsState>()(
  immer(set => ({
    contacts: null,
    isLoading: false,
    GetContacts: async (
      token: string,
      refreshToken: string,
      userId: string,
      update: Function,
    ) => {
      set({ isLoading: true });
      const res = await RenewWrapper(
        FetchFriends,
        [token],
        RenewToken,
        [userId, refreshToken],
        update,
        tokenUpdateStateGlobal,
      );
      let users = null;
      if (res.errors == false && res.friendsCount != 0) {
        users = res.users.slice(0, 4);
      }
      set({ contacts: users, isLoading: false });
    },
    updateContacts: (contacts: any[] | null) => set({ contacts: contacts }),
    updateLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
  })),
);

interface WhoToFollowState {
  contacts: any[] | null;
  GetContacts: (
    token: string,
    refreshToken: string,
    userId: string,
    update: Function,
  ) => void;
  updateContacts: (contacts: any[] | null) => void;
  isLoading: boolean;
  updateLoading: (isLoading: boolean) => void;
}

export const useWhoToFollow = create<WhoToFollowState>()(
  immer(set => ({
    contacts: null,
    isLoading: false,
    GetContacts: async (
      token: string,
      refreshToken: string,
      userId: string,
      update: Function,
    ) => {
      set({ isLoading: true });
      const res = await RenewWrapper(
        FetchWhoToFollow,
        [token],
        RenewToken,
        [userId, refreshToken],
        update,
        tokenUpdateStateGlobal,
      );
      let users = null;
      if (res.errors == false && res.recs != null) {
        users = res.recs.slice(0, 8);
      }
      set({ contacts: users, isLoading: false });
    },
    updateContacts: (contacts: any[] | null) => set({ contacts: contacts }),
    updateLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
  })),
);

interface FavoritesState {
  posts: any[];
  page: number;
  size: number;
  args: string;
  isLoading: boolean;
  hasMore: boolean;
  totalPages: number;
  error: () => void;
  updatePosts: (posts: []) => void;
  updatePage: (page: number) => void;
  updateSize: (size: number) => void;
  updateError: (error: () => void) => void;
  nextPosts: (
    token: string,
    refreshToken: string,
    userId: string,
    update: Function,
  ) => Promise<number>;
}

export const useFavorites = create<FavoritesState>()(
  immer(set => ({
    posts: [],
    page: 1,
    size: 18,
    hasMore: false,
    args: "",
    isLoading: false,
    totalPages: 0,
    error: () => {},
    updatePosts: (posts: []) => set({ posts: posts }),
    updatePage: (page: number) => set({ page: page }),
    updateSize: (size: number) => set({ size: size }),
    updateError: (error: () => void) => set({ error: error }),
    nextPosts: async (
      token: string,
      refreshToken: string,
      userId: string,
      update: Function,
    ) => {
      let args = "";
      let error = () => {};
      set(state => {
        args = `page=${state.page}&size=${state.size}`;
      });
      set({ isLoading: true });
      const res = await RenewWrapper(
        FetchFavorites,
        [args, token],
        RenewToken,
        [userId, refreshToken],
        update,
        tokenUpdateStateGlobal,
      );

      if (res.error) {
        error();
        return 1;
      } else {
        set(state => {
          state.page == 1
            ? (state.posts = res.posts)
            : state.posts.push(...res.posts);
          state.totalPages = res.totalPages;
        });
      }
      set({ isLoading: false });
      return 0;
    },
  })),
);

// interface DialogFavoritesState {
//   currentPostIndex: number | undefined;
//   isOpen: boolean;
//   updateCurrentPostIndex: (currentPostIndex: number) => void;
//   updateIsOpen: (isOpen: boolean) => void;
// }

// export const useDialogFavorites = create<DialogFavoritesState>()(
//   immer(set => ({
//     currentPostIndex: undefined,
//     isOpen: false,
//     updateCurrentPostIndex: (currentPostIndex: number) =>
//       set({ currentPostIndex: currentPostIndex }),
//     updateIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
//   })),
// );

interface SubCommentsState {
  subComms: any[];
  page: number;
  size: number;
  args: string;
  isLoading: boolean;
  getAllReplysFromComments: (id: string) => void;
  updateSubComments: (subComms: any[]) => void;
}

export const useSubComments = create<SubCommentsState>()(
  immer(set => ({
    subComms: [],
    page: 1,
    size: 100000,
    isLoading: false,
    args: "",
    updateSubComments: (subComms: any[]) => set({ subComms: subComms }),
    getAllReplysFromComments: async (id: string) => {
      let args = "";
      set(state => {
        args = `page=${state.page}&size=${state.size}`;
      });
      console.log(id, args);
      set({ isLoading: true });
      const res = await FetchReplyComments(args, id);
      console.log(res);
      set({ isLoading: false });
    },
  })),
);
