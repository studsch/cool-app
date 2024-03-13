import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  className?: string;
  src?: string;
  title?: string;
  subtitle?: string;
  fallback?: string;
  classNames?: { img?: string; title?: string; subtitle?: string };
  avatarPosition?: "left" | "right" | "other" | "card";
};

export default function AvatarBlock(props: Props) {
  const {
    src = "https://github.com/shadcn.png",
    title = "Morty Sanches",
    subtitle = "14 September",
    classNames = { img: "", title: "", subtitle: "" },
    avatarPosition = "left",
    ...restProps
  } = props;

  return (
    <div className="flex items-center">
      {avatarPosition === "right" && (
        <div className="grid place-content-center mb-4 mt-4 mr-4">
          <Avatar className={classNames?.img}>
            <AvatarImage src={src} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}
      {avatarPosition === "other" && (
        <div className="grid place-content-center">
          <Avatar className={classNames?.img}>
            <AvatarImage src={src} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}

      {avatarPosition === "card" && (
        <div className="grid place-content-center">
          <Avatar className="h-[55px] w-[55px]">
            <AvatarImage src={src} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="flex-col">
        <p
          className={`pl-4 pr-4 text-sm font-medium text-text-primary-color ${classNames.title}`}
        >
          {title}
        </p>

        <p
          className={`pl-4 pr-4 text-sm font-medium text-text-secondary-color ${classNames.subtitle}`}
        >
          {subtitle}
        </p>
      </div>

      {avatarPosition === "left" && (
        <div className="grid place-content-center mb-4 mt-4 mr-4 ml-4">
          <Avatar className={classNames?.img}>
            <AvatarImage src={src} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
