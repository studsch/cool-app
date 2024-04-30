import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

export async function RenewToken(userId: string, refreshToken: string) {
  console.log(userId);
  console.log(refreshToken);
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          refreshToken: refreshToken,
        }),
      },
    );
    const json = await result.json();
    return json;
  }
}

export async function RenewWrapper(
  func1: Function,
  args1: any[],
  renew: Function,
  args2: any[],
  session: any,
  update: Function,
) {
  const serverSession = await getSession();
  console.log("Server", serverSession);
  console.log("Client", session);

  let res1 = await func1(...args1);
  if (res1.status == 401 || res1 == 401) {
    const resRenew = await renew(...args2);
    console.log(
      "server",
      serverSession,
      "client",
      session,
      "resRenew",
      resRenew,
    );
    if (
      resRenew.error == false &&
      serverSession?.user.tokens.refresh != resRenew.tokens.refresh
    ) {
      console.log(
        resRenew.tokens.access,
        resRenew.tokens.refresh,
        serverSession?.user.tokens.refresh,
      );
      update({
        needUpdateTokens: true,
        tokens: {
          access: resRenew.tokens.access,
          refresh: resRenew.tokens.refresh,
        },
      });
    } else if (resRenew.status >= 400 && resRenew.status < 500) {
      // signOut({ callbackUrl: "/enter" });
      return;
    }
    res1 = await func1(...args1);
  }
  return res1;
}
