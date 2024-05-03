export async function Like(token: string, id: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_LIKE_POST
  ) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL + process.env.NEXT_PUBLIC_URL_LIKE_POST,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          postID: id,
        }),
      },
    );
    return response.status;
  }
}

export async function UnLike(token: string, id: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_LIKE_POST
  ) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL + process.env.NEXT_PUBLIC_URL_LIKE_POST,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          postID: id,
        }),
      },
    );
    return response.status;
  }
}
