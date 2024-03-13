"use client";

import { useState } from "react";
import Button from "../ui/button/Button";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  classNames?: {};
  isSubscribed: boolean;
  onClick?: () => {};
};
const SubscribeButton: React.FC<Props | any> = props => {
  const [isSubscribed, setIsSubscribed] = useState(props.isSubscribed);
  const {
    classNames,
    restProps,
    onClick = () => {
      return true;
    },
  } = props;
  return (
    <div className="">
      <Button
        type="button"
        text={!isSubscribed ? "Subscribe" : "Unsubscribe"}
        onClick={() => {
          onClick() ? setIsSubscribed(!isSubscribed) : null;
        }}
        className={cn(
          !isSubscribed && "btn btn-primary",
          isSubscribed && "btn btn-secondary",
        )}
      ></Button>
    </div>
  );
};

export default SubscribeButton;
