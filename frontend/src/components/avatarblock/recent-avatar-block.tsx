import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RecentAvatarBlockProps from "@/interfaces/RecentAvatarBlock";

const RecentAvatarBlock = (props: RecentAvatarBlockProps) => {
  return (
    <>
      <Avatar className={`mx-auto ${props.classNames?.avatar?.base}`}>
        <AvatarImage
          src={props.img}
          className={`${props.classNames?.avatar?.img}`}
        />
        <AvatarFallback className={`${props.classNames?.avatar?.fallback}`}>
          CN
        </AvatarFallback>
      </Avatar>
      <p
        className={`text-center text-text-primary-color truncate ...  my-1 mx-1 ${props.classNames?.text?.base}`}
      >
        {props.text}
      </p>
    </>
  );
};

RecentAvatarBlock.defaultProps = {
  classNames: {
    avatar: { base: "", fallback: "", img: "" },
    text: { base: "" },
  },
};
export default RecentAvatarBlock;
