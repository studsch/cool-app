"use server";
import { ChangePassword } from "@/fetch/auth";

export async function ServerAction(number: string, password: string) {
  const res = await ChangePassword(number, password);
  return res;
}
