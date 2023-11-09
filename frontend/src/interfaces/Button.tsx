interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
  text?: string;
  onClick?: () => void;
}

export default ButtonProps;
