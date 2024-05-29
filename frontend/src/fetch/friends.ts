export async function FetchFriends(token: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_FRIENDS
  ) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL + process.env.NEXT_PUBLIC_URL_FRIENDS,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    );
    const responeJson = await response.json();
    return responeJson;
  }
}

export async function FetchWhoToFollow(token: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_WHO_TO_FOLLOW
  ) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_WHO_TO_FOLLOW,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    );
    const responeJson = await response.json();
    return responeJson;
  }
}
