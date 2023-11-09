"use client";
import React from "react";
import Button from "../ui/button/Button";
import ButtonProps from "@/interfaces/Button";
import { signOut } from "next-auth/react";
export default function LogOutButton(props: ButtonProps) {
  return (
    <Button
      className={props.className}
      type={props.type}
      text="Sign out"
      onClick={() => {
        signOut({ callbackUrl: "/" });
        console.log("logout");
      }}
    />
  );
}
