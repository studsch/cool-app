import { getServerSession, type AuthOptions, type User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { use } from "react";
import { string } from "zod";
export const authConfig: AuthOptions = {
    providers: [Credentials({
        credentials: {
            login: {label: 'login', type: "text", required: true},
            password: {label: 'password', type: "password", required: true}
        },
        async authorize(credentials) {
            if (!credentials?.login || !credentials?.password || process.env.NEXT_PUBLIC_DOMEN_URL === undefined ||
                process.env.NEXT_PUBLIC_URL === undefined) return {name:"pizda"} as User;
            const response = await fetch(process.env.NEXT_PUBLIC_DOMEN_URL + process.env.NEXT_PUBLIC_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({login: credentials.login, password: credentials.password}),
              })
              const responeJson = await response.json();
              const {data, ...errorData} = responeJson;
              if (errorData.error) return {msg: errorData.msg, error: errorData.error} as User
            return {id: data['ID'], phone: data['Phone'], name: data['Name'], surname: data['Surname'],
            date_of_birth: data['DateOfBirth'], gender: data['Gender'], created_at: data['CreatedAt'],
            updated_at: data['UpdatedAt'], user_role: data['UserRole'], deleted: data['Deleted'], login: data['Login']
        } as User
        }}
    )],
    pages: {
        signIn: '/enter'
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                return{
                    ...token,
                    login: user.login,
                    phone: user.phone,
                    name: user.name,
                    surname: user.surname,
                    date_of_birth: user.date_of_birth,
                    gender: user.gender,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    user_role: user.user_role,
                    deleted: user.deleted
                    
                }
            }
            return token
        },
        async session({session, token}) {
            return{
                ...session,
                user: {
                    ...session.user,
                    login: token.login,
                    phone: token.phone,
                    name: token.name,
                    surname: token.surname,
                    date_of_birth: token.date_of_birth,
                    gender: token.gender,
                    created_at: token.created_at,
                    updated_at: token.updated_at,
                    user_role: token.user_role,
                    deleted: token.deleted
                }
            }
        },
            async signIn({ user, account, profile, email, credentials }) {
              const isAllowedToSignIn = true
              const session = await getServerSession(authConfig)
              // console.log(session)
              if (session) {
                throw new Error("User already sign in")
              }
              const msgs = ["user with the given login is not found", "wrong user login or password"]
              if (user.error && user.msg) {
                if (!msgs.includes(user.msg)){
                  throw new Error("Something went wrong")
                }
                else{
                  user.msg = user.msg[0].toUpperCase() + user.msg.slice(1)
                throw new Error(user.msg)}
              }
              if (isAllowedToSignIn) {
                return true
              } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
              }
            }
          
      }
    }