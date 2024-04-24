export async function FollowTo(token: string, id: string) {
    if (
      process.env.NEXT_PUBLIC_DOMEN_URL &&
      process.env.NEXT_PUBLIC_URL_FOLLOW_TO
    ) {
        const response = await fetch(
            process.env.NEXT_PUBLIC_DOMEN_URL +
            process.env.NEXT_PUBLIC_URL_FOLLOW_TO,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                followToUserId: id
              }),
            }
            
          );
      return response.status;
    }
  }

export async function UnFollowFrom(token: string, id: string) {
    if (
        process.env.NEXT_PUBLIC_DOMEN_URL &&
        process.env.NEXT_PUBLIC_URL_FOLLOW_TO
      ) {
          const response = await fetch(
              process.env.NEXT_PUBLIC_DOMEN_URL +
              process.env.NEXT_PUBLIC_URL_FOLLOW_TO + id,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              },
              
            );
        return response.status;
      }
}

  