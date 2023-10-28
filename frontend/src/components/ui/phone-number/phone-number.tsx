"use client";

import "react-phone-number-input/style.css";
import { useState } from "react";
import PhoneInput, { formatPhoneNumber } from "react-phone-number-input";
import "./phone.scss";
import Input from "../input/Input";

const PhoneNumberInput = () => {
  const [value, setValue] = useState<any>();
  return (
    <>
      <div className="flex flex-col">
        <PhoneInput
          className="columns-1"
          defaultCountry="RU"
          placeholder="Enter phone number"
          international
          withCountryCallingCode
          value={value}
          onChange={value => {
            setValue(value);
          }}
        />
        <p className="error-text st lt hidden">
          Ошибка, введен некорректный номер
        </p>
      </div>
    </>
  );
};

export default PhoneNumberInput;
