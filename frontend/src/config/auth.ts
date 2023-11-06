import type { AuthOptions, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
export const authConfig: AuthOptions = {
    providers: [Credentials({
        credentials: {
            login: {label: 'login', type: "text", required: true},
            password: {label: 'password', type: "password", required: true}
        },
        async authorize(credentials) {
            if (!credentials?.login || !credentials.password) return null;
            return {id: "1", data: credentials} as User
            return null
        }}
    )],
    pages: {
        signIn: '/enter'
    }
}