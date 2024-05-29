// import { signOut } from "next-auth/react";
// import { getSession } from "next-auth/react";
// import { Mutex } from "async-mutex";
import { getSession } from "next-auth/react";

// export async function RenewToken(userId: string, refreshToken: string) {
//   if (
//     process.env.NEXT_PUBLIC_DOMEN_URL &&
//     process.env.NEXT_PUBLIC_URL_RENEW_TOKEN
//   ) {
//     const result = await fetch(
//       process.env.NEXT_PUBLIC_DOMEN_URL +
//         process.env.NEXT_PUBLIC_URL_RENEW_TOKEN,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: userId,
//           refreshToken: refreshToken,
//         }),
//       },
//     );
//     const json = await result.json();
//     return json;
//   }
// }

// export const tokenUpdateStateGlobal = {
//   renewalPromise: null as Promise<any> | null,
// };

// const testArr: any[] = [0, 0];

// let tokenRenewalPromise: Promise<{
//   error: boolean;
//   tokens?: { access: string; refresh: string };
//   status?: number;
// }> | null = null;

// export function getTokenRenewalPromise() {
//   return tokenRenewalPromise;
// }

// export function setTokenRenewalPromise(
//   promise: Promise<{
//     error: boolean;
//     tokens?: { access: string; refresh: string };
//     status?: number;
//   }> | null,
// ) {
//   tokenRenewalPromise = promise;
// }

// export async function RenewWrapper(
//   func1: Function,
//   args1: any[],
//   renew: Function,
//   args2: any[],
//   update: Function,
//   tokenUpdateState: any,
// ) {
//   let result = await func1(...args1);

//   if (result.status === 401 || result === 401) {
//     if (getTokenRenewalPromise() === null) {
//       if (testArr[0] == 0) {
//         testArr[0] = args2[1];
//       }
//       const newPromise = renew(args2[0], testArr[0])
//         .then(renewalResult => {
//           if (!renewalResult.error && renewalResult.tokens) {
//             testArr[0] = renewalResult.tokens.refresh;
//             update({
//               needUpdateTokens: true,
//               tokens: {
//                 access: renewalResult.tokens.access,
//                 refresh: renewalResult.tokens.refresh,
//               },
//             });
//             return renewalResult;
//           }
//           // throw new Error("Failed to renew tokens");
//           signOut();
//         })
//         .catch(err => {
//           throw err;
//         })
//         .finally(() => {
//           setTokenRenewalPromise(null);
//         });

//       setTokenRenewalPromise(newPromise);
//     }

//     const renewalResult = await getTokenRenewalPromise();
//     if (!renewalResult.error && renewalResult.tokens) {
//       result = await func1(...args1);
//     }
//   }

//   return result;
// }
let tokenRefreshSemaphore = 1;

export async function FetchWithTokenRefresh(func: Function, ...args: any) {
  await acquireTokenRefreshSemaphore();
  const update: Function = args[args.length - 1];
  const session = await getSession();
  args[0] = session?.user.tokens.access;
  console.log("pre");
  let res = await func(...args);
  if (res.status == 401 || res == 401) {
    const resRefresh = await refreshToken(update);
    if (resRefresh.status == 422) {
      console.log("signout");
    } else {
      await update({
        needUpdateTokens: true,
        tokens: {
          access: resRefresh.tokens.access,
          refresh: resRefresh.tokens.refresh,
        },
      });
      const sessionO = await getSession();
      console.log(sessionO);
    }
    args[0] = resRefresh.tokens.access;
    res = await func(...args);
  }
  releaseTokenRefreshSemaphore();

  console.log(res);
  return res;
}

async function refreshToken(update: Function) {
  console.log("2");
  const session = await getSession();
  console.log(session);
  if (session?.user?.id) {
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
            userId: session?.user?.id,
            refreshToken: session?.user?.tokens.refresh,
          }),
        },
      );
      const json = await result.json();
      console.log(json);
      return json;
    }
  }
}

async function acquireTokenRefreshSemaphore() {
  console.log(tokenRefreshSemaphore);
  while (tokenRefreshSemaphore <= 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  tokenRefreshSemaphore--;
}

function releaseTokenRefreshSemaphore() {
  tokenRefreshSemaphore++;
}
