"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faUserPlus, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import PeopleAddButton from "@/interfaces/PeopleAddButton";

const AddButton: React.FC<PeopleAddButton> = props => {
  const [isSubToggle, setsubIsSubToggle] = useState(false);

  const changeIsSubToggle = () => {
    setsubIsSubToggle(!isSubToggle);
  };
  return (
    <>
      <button
        type="button"
        onClick={changeIsSubToggle}
        className={`mx-auto ${props.className}`}
      >
        {!isSubToggle ? (
          <FontAwesomeIcon
            className="text-button-primary-color hover:text-link-primary-color transition"
            icon={faUserPlus}
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserMinus}
            className="text-gray-300 hover:text-gray-400 transition"
          />
        )}
      </button>
    </>
  );
};

export default AddButton;
