import InputProps from "@/interfaces/Input";

const Input = (props: InputProps) => {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      className={props.className}
    />
  );
};

export default Input;
