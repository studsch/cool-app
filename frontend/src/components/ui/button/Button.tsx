import ButtonProps from "@/interfaces/Button";

const Button = (props: ButtonProps) => {
  return (
    <button
      id={props.id}
      name={props.name}
      disabled={props.disabled}
      ref={props.ref}
      className={props.className}
      type={props.type}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;
