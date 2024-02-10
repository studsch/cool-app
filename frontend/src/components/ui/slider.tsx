import React from "react";
import { Slider } from "@nextui-org/react";

export default function App() {
  return (
    <Slider
      showTooltip={false}
      step={0.2}
      color="success"
      formatOptions={{ style: "percent" }}
      maxValue={1}
      minValue={0}
      marks={[
        {
          value: 0,
          label: "1.2X",
        },
        {
          value: 0.2,
          label: "1.5X",
        },
        {
          value: 0.4,
          label: "2.0X",
        },
        {
          value: 0.6,
          label: "3.0X",
        },
        {
          value: 0.8,
          label: "5.0X",
        },
        {
          value: 1,
          label: "10X",
        },
      ]}
      defaultValue={0.2}
      className="max-w-md"
    />
  );
}
