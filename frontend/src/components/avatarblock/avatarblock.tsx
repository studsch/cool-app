import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { map, string } from "zod";

type Props = {
  className?: string;
  src?: string;
  title?: string;
  subtitle?: string;
  fallback?: string;
  classNames?: { img?: string; title?: string; subtitile?: string };
};

export default function AvatarBlock(props: Props) {
  const {
    src = "https://github.com/shadcn.png",
    title = "Morty Sanches",
    subtitle = "14 September",
    classNames = { img: "", title: "", subtitile: "" },
    ...restProps
  } = props;
  return (
    <div className="flex items-center">
      <div className="grid place-content-center">
        <Avatar className={classNames?.img}>
          <AvatarImage src={src} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-col">
        <div className="pl-4 grid place-content-left">
          <div className="text-black">{title}</div>
        </div>
        <div className="pl-4 grid place-content-left">
          <div className="text-slate-400">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
