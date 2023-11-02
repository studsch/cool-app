"use client";

import React from "react";

type Props = {
  className?: string;
  onClickFunction?: React.MouseEventHandler<HTMLHeadingElement> | undefined;
  text?: string;
};

const switch_reg_log_windows = () => {
  const log_window = document.querySelector("#log-window");
  const create_window = document.querySelector("#reg-window");
  log_window?.classList.toggle("hidden");
  log_window?.classList.toggle("flex");
  create_window?.classList.toggle("hidden");
  create_window?.classList.toggle("flex");
};

const EnterToggleLink: React.FC<Props> = props => {
  return (
    <h5 className={`${props.className}`} onClick={switch_reg_log_windows}>
      {props.text}
    </h5>
  );
};

export default EnterToggleLink;
