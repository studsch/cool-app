import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarBlockProps {
  avatarPosition: "left" | "right";
}

export default function AvatarBlock({ avatarPosition }: AvatarBlockProps) {
  return (
    <div className="flex items-center">
      {avatarPosition === "left" && (
        <div className="grid place-content-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="flex-col">
        <div className="pl-4 pr-4 grid place-content-left">
          <div className="text-black">Morty Sanches</div>
        </div>
        <div className="pl-4 pr-4 grid place-content-left">
          <div className="text-slate-400">14 September</div>
        </div>
      </div>

      {avatarPosition === "right" && (
        <div className="grid place-content-left">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
