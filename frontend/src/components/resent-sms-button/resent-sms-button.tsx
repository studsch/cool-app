import React from "react";
import Button from "../ui/button/Button";

interface IResetSmsButton {
  className?: string;
}

export default function ResentSmsButton(props: IResetSmsButton) {
  return <Button type="button" text="Resent" className={props.className} />;
}
