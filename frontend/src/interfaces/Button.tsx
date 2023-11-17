import type { LegacyRef } from "react";

interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
  text?: string;
  ref?: LegacyRef<HTMLButtonElement> | undefined;
  disabled?: boolean;
  onClick?: () => void;
}

export default ButtonProps;
