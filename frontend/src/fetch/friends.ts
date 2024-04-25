import { RenewToken } from "./token";

export async function FetchFriends(token: string, refreshToken: string) {
    if (
      process.env.NEXT_PUBLIC_DOMEN_URL &&
      process.env.NEXT_PUBLIC_URL_FRIENDS
    ) {
        const response = await fetch(
            process.env.NEXT_PUBLIC_DOMEN_URL +
            process.env.NEXT_PUBLIC_URL_FRIENDS,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              }
            }
          );
        const responeJson = await response.json();
        if (responeJson.status == 401) {
          const res = await RenewToken(refreshToken)
          console.log(res)
        }
      return responeJson;
    }
  }

  