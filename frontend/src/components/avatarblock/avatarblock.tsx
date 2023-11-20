import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarBlock() {
  return (
    <div className="flex">
      <div className="grid place-content-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-col">
        <div className="pl-4 grid place-content-left">
          <div className="text-black">Morty Sanders</div>
        </div>
        <div className="pl-4 grid place-content-left">
          <div className="text-slate-400">14 September</div>
        </div>
      </div>
    </div>
  );
}
