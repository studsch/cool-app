import NextAuth from "next-auth";

declare module "next-auth" {
  interface Token {
    id: string;
    firstName: string;
    lastName: string;
    login: string;
    phoneNumber: string;
    role: string;
    avatar: string | undefined;
    gender: string;
    about: string | undefined;
    city: string | undefined;
    country: string | undefined;
    birthday: string;
    createdAt: string;
    updatedAt: string;
    subscriptionsCount: number;
    subscribersCount: number;
    publicationCount: number;
    tokens: { access: string; refresh: string };
  }
  interface User extends Token {
    error: boolean | undefined;
    msg: string | undefined;
  }
  interface Session {
    user: User;
    token: Token;
  }
}
