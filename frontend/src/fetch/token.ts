import { signOut } from "next-auth/react";

export async function RenewToken(userId: string, refreshToken: string) {
    if (
      process.env.NEXT_PUBLIC_DOMEN_URL &&
      process.env.NEXT_PUBLIC_URL_RENEW_TOKEN
    ) {
      const result = await fetch(
        process.env.NEXT_PUBLIC_DOMEN_URL +
          process.env.NEXT_PUBLIC_URL_RENEW_TOKEN,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                refreshToken: refreshToken
              }),
          }
      );
      const json = await result.json();
      return json;
    }
  }
  
export async function RenewWrapper(func1: Function, args1: any[], renew: Function, args2: any[]) {
  let res1 = await func1(...args1)
  if (res1.status == 401 || res1 == 401) {
    console.log(res1)
    const resRenew = renew(...args2)
    if (resRenew.status >= 400 && resRenew.status < 500)
    {
      signOut();
      return;
    }
    res1 = await func1(...args1)
  }
  return res1
} 