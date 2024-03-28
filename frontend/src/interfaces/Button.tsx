import type { LegacyRef } from "react";

interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  children?: React.ReactNode;
  name?: string;
  className?: string;
  text?: string;
  id?: string;
  ref?: LegacyRef<HTMLButtonElement> | undefined;
  disabled?: boolean;
  onClick?: () => void;
}

export default ButtonProps;
