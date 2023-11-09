import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    login: string,
    phone: string,
    name: string,
    surname: string,
    date_of_birth: string,
    gender: string,
    created_at: string,
    updated_at: string,
    user_role: string,
    deleted: string,
    error: boolean | undefined,
    msg: string | undefined
  }
  interface Session {
    user: User & {
      /** The user's postal address. */
      login: string,
      phone: string,
      name: string,
      surname: string,
      date_of_birth: string,
      gender: string,
      created_at: string,
      updated_at: string,
      user_role: string,
      deleted: string,
    }
    token: {
        login :string,
        phone: string,
        name: string,
        surname: string,
        date_of_birth: string,
        gender: string,
        created_at: string,
        updated_at: string,
        user_role: string,
        deleted: string,
    }
  }
}