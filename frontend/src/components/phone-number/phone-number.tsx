"use client";

import "react-phone-number-input/style.css";
import { useState } from "react";
import PhoneInput, { formatPhoneNumber } from "react-phone-number-input";
import "./phone.scss";

type Props = {
  className?: string;
};

const PhoneNumberInput: React.FC<Props> = ({ className }) => {
  const [value, setValue] = useState<any>();
  return (
    <>
      <PhoneInput
        className={className}
        defaultCountry="RU"
        placeholder="Enter phone number"
        international
        withCountryCallingCode
        value={value}
        onChange={value => {
          setValue(value);
        }}
      />
      {/* <p className="error-text st lt hidden">
          Ошибка, введен некорректный номер
        </p> */}
    </>
  );
};

export default PhoneNumberInput;
