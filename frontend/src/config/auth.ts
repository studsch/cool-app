import { getServerSession, type AuthOptions, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
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
        // console.log(user);
        if (error) return { msg: error, error: error } as User;
        return {
          ...user,
          tokens: { ...tokens },
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
          ...user,
          tokens: { ...tokens },
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
<<<<<<< HEAD
=======
        console.log("JESTKII TRIGGER");
        // console.log(session.user);
>>>>>>> 1e3589219ccffa4fda297c555701542b02f6f9ef
        if (session.needUpdateTokens) {
          // console.log(session.tokens);
          return { ...token, tokens: session.tokens };
        }
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
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                login: session.user.login,
                password: session.user.password,
                phoneNumber: session.user.phoneNumber,
                gender: session.user.gender,
                about: session.user.about,
                city: session.user.city,
                country: session.user.country,
              }),
            },
          );
          const responeJson = await response.json();
          // console.log(responeJson);
          const { error } = responeJson;
<<<<<<< HEAD
          if (!error)
            return {
              ...token,
              ...session.user,
            };
=======
          if (!error) return { ...token, ...session.user };
>>>>>>> 1e3589219ccffa4fda297c555701542b02f6f9ef
          // console.log("dasdasdas")
          // return {...token, tokens: session.user.tokens}
        }
      }
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
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
