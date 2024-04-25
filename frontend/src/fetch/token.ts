export async function RenewToken(refreshToken: string) {
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
                refreshToken: refreshToken
              }),
          }
      );
      const json = await result.json();
      console.log("renew ->")
      console.log(json)
      return json;
    }
  }
  