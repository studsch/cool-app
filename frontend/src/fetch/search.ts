export async function FetchUsers(token: string, args: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_SEARCH_USER
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_SEARCH_USER +
        args,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    );
    const json = await result.json();
    return json;
  }
}

export async function FetchPosts(token: string, args: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_SEARCH_POST
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_SEARCH_POST +
        args,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    );
    const json = await result.json();
    return json;
  }
}
