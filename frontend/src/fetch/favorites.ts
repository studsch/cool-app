"use server";

export async function FetchFavorites(token: string, args: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_FAVORITES
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_FAVORITES +
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

export async function FetchFavoriteWidget(token: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_GET_FAVORITE_WIDGET
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_GET_FAVORITE_WIDGET,
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
