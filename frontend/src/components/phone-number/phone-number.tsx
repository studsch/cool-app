"use client";
import "react-phone-number-input/style.css";
import { useState } from "react";
import PhoneInput, { formatPhoneNumber } from "react-phone-number-input";
import "./phone.scss";
import Input from "../ui/input/Input";

type Props = {
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
};

const PhoneNumberInput: React.FC<Props | any> = props => {
  const [value, setValue] = useState<any>(props.defaultValue);
  return (
    <>
      <PhoneInput
        className={props.className}
        defaultCountry="RU"
        placeholder="Enter phone number"
        international
        withCountryCallingCode
        value={value}
        disabled={props.disabled}
        onChange={value => {
          setValue(value);
        }}
        {...props.field}
      />
      {/* <p className="error-text st lt hidden">
          Ошибка, введен некорректный номер
        </p> */}
    </>
  );
};

export default PhoneNumberInput;
