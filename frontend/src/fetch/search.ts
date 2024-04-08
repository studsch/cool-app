export async function FetchUsers(args: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_SEARCH_USER
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_SEARCH_USER +
        args,
    );
    const json = await result.json();
    return json;
  }
}

export async function FetchPosts(args: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_SEARCH_POST
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_SEARCH_POST +
        args,
    );
    const json = await result.json();
    return json;
  }
}
