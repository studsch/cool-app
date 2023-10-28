import Checkbox from "@/interfaces/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Checkbox = (props: Checkbox) => {
  return (
    <div className="checkbox flex">
      <input type="checkbox" className={props.className} />
      <label className={props.textClassName}>{props.text}</label>
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};

export default Checkbox;
