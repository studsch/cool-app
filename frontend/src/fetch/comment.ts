export async function FetchComments(args: string, postId: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_GET_ALL_COMMENTS
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_GET_ALL_COMMENTS +
        postId +
        args,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const json = await result.json();
    return json;
  }
}

export async function FetchReplyComments(args: string, id: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_GET_ALL_COMMENTS
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_GET_ALL_COMMENTS +
        id +
        "/reply" +
        args,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const json = await result.json();
    return json;
  }
}
export async function PostComment(
  token: string,
  postId: string,
  content: string,
  reply: string = "00000000-0000-0000-0000-000000000000",
) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_GET_COMMENT
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_GET_COMMENT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          postId: postId,
          content: content,
          replyTo: reply,
        }),
      },
    );
    const json = await result.json();
    return json;
  }
}
