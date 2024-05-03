import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toNormalDateTime } from "@/lib/utils";
export default function Comment({
  src,
  userTitle,
  comment,
  createdAt,
  classNames,
}: {
  src: string;
  userTitle: string;
  comment: string;
  createdAt: string;
  classNames?: { img?: string };
}) {
  return (
    <div className="flex gap-3 my-2">
      <Avatar className={classNames?.img}>
        <AvatarImage src={src} />
        <AvatarFallback>{userTitle.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="h-5 text-sm">{userTitle}</p>
        <p className="text-sm">{comment}</p>
        <div className="flex gap-2">
          <p className="text-text-secondary-color text-sm ">
            {toNormalDateTime(createdAt)}
          </p>
          <p className="link text-sm">Reply</p>
        </div>
      </div>
    </div>
  );
}
