import { getServerSession, type AuthOptions, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { use } from "react";
import { string } from "zod";
export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        login: { label: "login", type: "text", required: true },
        password: { label: "password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (
          !credentials?.login ||
          !credentials?.password ||
          process.env.NEXT_PUBLIC_DOMEN_URL === undefined ||
          process.env.NEXT_PUBLIC_URL === undefined
        )
          return null;
        const response = await fetch(
          process.env.NEXT_PUBLIC_DOMEN_URL + process.env.NEXT_PUBLIC_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              login: credentials.login,
              password: credentials.password,
            }),
          },
        );
        const responeJson = await response.json();
        const { user, error, tokens } = responeJson;
        if (error) return { msg: error, error: error } as User;
        return {
          id: user["id"],
          phone: user["phone"],
          name: user["firstName"],
          surname: user["lastName"],
          date_of_birth: user["birthday"],
          gender: user["gender"],
          created_at: user["createdAt"],
          updated_at: user["updatedAt"],
          user_role: user["userRole"],
          deleted: user["deleted"],
          login: user["login"],
          about: user["about"],
          avatar: user["avatar"],
          tokens: tokens,
          city: user["none"],
          country: user["none"],
        } as User;
      },
    }),
    CredentialsProvider({
      id: "phone-enter",
      name: "phone credentials",
      credentials: {
        phoneNumber: { label: "phoneNumber", type: "text", required: true },
        password: { label: "password", type: "password", required: true },
      },
      async authorize(credentials: any, req: any) {
        if (
          !credentials?.phoneNumber ||
          !credentials?.password ||
          process.env.NEXT_PUBLIC_DOMEN_URL === undefined ||
          process.env.NEXT_PUBLIC_URL === undefined
        )
          return null;
        const response = await fetch(
          process.env.NEXT_PUBLIC_DOMEN_URL + process.env.NEXT_PUBLIC_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phoneNumber: credentials.phoneNumber,
              password: credentials.password,
            }),
          },
        );
        const responeJson = await response.json();
        const { user, error, tokens } = responeJson;
        if (error) return { msg: error, error: error } as User;
        return {
          id: user["id"],
          phone: user["phone"],
          name: user["firstName"],
          surname: user["lastName"],
          date_of_birth: user["birthday"],
          gender: user["gender"],
          created_at: user["createdAt"],
          updated_at: user["updatedAt"],
          user_role: user["userRole"],
          deleted: user["deleted"],
          login: user["login"],
          about: user["about"],
          avatar: user["avatar"],
          tokens: tokens,
          city: user["none"],
          country: user["none"],
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/enter",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (
        trigger == "update" &&
        process.env.NEXT_PUBLIC_DOMEN_URL &&
        process.env.NEXT_PUBLIC_URL_UPDATE
      ) {
        if (session.user) {
          const response = await fetch(
            process.env.NEXT_PUBLIC_DOMEN_URL +
              process.env.NEXT_PUBLIC_URL_UPDATE +
              session.user.id,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session.user.tokens.access,
              },
              body: JSON.stringify({
                firstName: session.user.name,
                lastName: session.user.surname,
                login: session.user.login,
                password: session.user.password,
                phoneNumber: session.user.phone,
                gender: session.user.gender,
                about: session.user.about,
                city: session.user.city,
                country: session.user.country,
              }),
            },
          );
          const responeJson = await response.json();
          console.log(responeJson);
          const { error } = responeJson;
          if (!error)
            return {
              ...token,
              id: session.user.id,
              login: session.user.login,
              phone: session.user.phone,
              name: session.user.name,
              surname: session.user.surname,
              date_of_birth: session.user.date_of_birth,
              gender: session.user.gender,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at,
              user_role: session.user.user_role,
              deleted: session.user.deleted,
              about: session.user.about,
              avatar: session.user.avatar,
              tokens: session.user.tokens,
              city: session.user.city,
              country: session.user.country,
            };
        }
      }
      if (user) {
        return {
          ...token,
          id: user.id,
          login: user.login,
          phone: user.phone,
          name: user.name,
          surname: user.surname,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
          created_at: user.created_at,
          updated_at: user.updated_at,
          user_role: user.user_role,
          deleted: user.deleted,
          about: user.about,
          avatar: user.avatar,
          tokens: user.tokens,
          city: user.city,
          country: user.country,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          login: token.login,
          phone: token.phone,
          name: token.name,
          surname: token.surname,
          date_of_birth: token.date_of_birth,
          gender: token.gender,
          created_at: token.created_at,
          updated_at: token.updated_at,
          user_role: token.user_role,
          deleted: token.deleted,
          about: token.about,
          avatar: token.avatar,
          tokens: token.tokens,
          city: token.city,
          country: token.country,
        },
      };
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      const session = await getServerSession(authConfig);
      // console.log(session)
      if (session) {
        throw new Error("User already sign in");
      }
      const msgs = [
        "user with the given login is not found",
        "wrong user login or password",
      ];
      if (user.error && user.msg) {
        if (!msgs.includes(user.msg)) {
          throw new Error("Something went wrong");
        } else {
          user.msg = user.msg[0].toUpperCase() + user.msg.slice(1);
          throw new Error(user.msg);
        }
      }
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
};
