import React from "react";
import { Checkbox, cn } from "@nextui-org/react";

const CheckboxDemo = () => {
  return (
    <div>
      <Checkbox
        classNames={{
          wrapper: "checkbox-wrapper-secondary",
          icon: "checkbox-icon-secondary",
        }}
        radius="sm"
        size="sm"
      >
        Option
      </Checkbox>
      <Checkbox
        classNames={{
          wrapper: "checkbox-wrapper-primary",
        }}
        radius="sm"
        color="secondary"
        size="sm"
      >
        Option
      </Checkbox>
    </div>
  );
};

export default CheckboxDemo;
