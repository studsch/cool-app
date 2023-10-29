import React from "react";
import { RadioGroup, Radio } from "@nextui-org/react";

export default function Radiobutton() {
  return (
    <RadioGroup
      label="Select your favorite city"
      classNames={{ wrapper: "primary-radiobutton" }}
    >
      <Radio value="buenos-aires" size="sm">
        Buenos Aires
      </Radio>
      <Radio
        value="buenos-airess"
        size="sm"
        classNames={{ label: "text-link-primary-color hover:underline" }}
      >
        Buenos Aires
      </Radio>
    </RadioGroup>
  );
}
