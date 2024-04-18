import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    login: string;
    phone: string;
    name: string;
    surname: string;
    date_of_birth: string;
    gender: string;
    created_at: string;
    updated_at: string;
    user_role: string;
    deleted: string;
    tokens: { access: string; refresh: string };
    error: boolean | undefined;
    msg: string | undefined;
    about: string | undefined;
    avatar: string | undefined;
  }
  interface Session {
    user: User & {
      /** The user's postal address. */
      id: string;
      login: string;
      phone: string;
      name: string;
      surname: string;
      date_of_birth: string;
      gender: string;
      about: string | undefined;
      avatar: string | undefined;
      created_at: string;
      updated_at: string;
      tokens: { access: string; refresh: string };
      user_role: string;
      deleted: string;
    };
    token: {
      id: string;
      login: string;
      phone: string;
      name: string;
      surname: string;
      about: string | undefined;
      avatar: string | undefined;
      date_of_birth: string;
      gender: string;
      created_at: string;
      updated_at: string;
      tokens: { access: string; refresh: string };
      user_role: string;
      deleted: string;
    };
  }
}
