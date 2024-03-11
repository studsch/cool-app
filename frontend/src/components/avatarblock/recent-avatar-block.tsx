import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RecentAvatarBlockProps from "@/interfaces/RecentAvatarBlock";

const RecentAvatarBlock = (props: RecentAvatarBlockProps) => {
  const {
    classNames = {
      avatar: { base: "", fallback: "", img: "" },
      text: { base: "" },
    },
  } = props;

  return (
    <>
      <Avatar className={`mx-auto ${classNames?.avatar?.base}`}>
        <AvatarImage src={props.img} className={`${classNames?.avatar?.img}`} />
        <AvatarFallback className={`${classNames?.avatar?.fallback}`}>
          CN
        </AvatarFallback>
      </Avatar>
      <p
        className={`text-center text-text-primary-color truncate ...  my-1 mx-1 ${classNames?.text?.base}`}
      >
        {props.text}
      </p>
    </>
  );
};

export default RecentAvatarBlock;
