import ButtonProps from "@/interfaces/Button";

const Button = (props: ButtonProps) => {
  return (
    <button className={props.className} type={props.type}>
      {props.text}
    </button>
  );
};

export default Button;
