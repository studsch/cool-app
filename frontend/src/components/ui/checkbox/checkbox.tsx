import React from "react";
import { Checkbox, cn } from "@nextui-org/react";

const CheckboxDemo = () => {
  return (
    <div>
      <Checkbox
        classNames={{
          base: "test",
          wrapper: "checkbox-wrapper-secondary",
          icon: "checkbox-icon-secondary",
          label: "checkbox-label",
        }}
        radius="sm"
        size="sm"
      >
        Option
      </Checkbox>
      <Checkbox
        classNames={{
          wrapper: "checkbox-wrapper-primary",
          label: "m-auto",
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
