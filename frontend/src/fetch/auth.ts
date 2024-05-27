export async function CheckLogin(login: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_CHECK_AUTH_LOGIN
  ) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_CHECK_AUTH_LOGIN +
        login,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responeJson: { errors: boolean; userExists: boolean } =
      await response.json();
    return responeJson.userExists;
  }
}

export async function CheckPhone(phone: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_CHECK_AUTH_PHONE
  ) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_CHECK_AUTH_PHONE +
        phone,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responeJson: { errors: boolean; userExists: boolean } =
      await response.json();
    return responeJson.userExists;
  }
}

export async function ChangePassword(phone: string, password: string) {
  if (
    process.env.NEXT_PUBLIC_DOMEN_URL &&
    process.env.NEXT_PUBLIC_URL_CHANGE_PASSWORD
  ) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_DOMEN_URL +
        process.env.NEXT_PUBLIC_URL_CHANGE_PASSWORD,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          password: password,
        }),
      },
    );
    return result.status;
  }
}
