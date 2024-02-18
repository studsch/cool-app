"use client";
import RecentAvatarBlock from "../avatarblock/recent-avatar-block";
import { DropdownMenu } from "../ui/dropdown-menu";
import UserDropdown from "../ui/DropSearchMenu";
import { Bookmark } from "lucide-react";
import Button from "../ui/button/Button";
import MemoriesSign from "../memories-sign/memoriesSign";

export default function TopBar() {
  return (
    <div className="h-[120px] flex ml-[330px] mr-[330px] border-2 rounded-lg">
      <div className="flex-initial w-[408px] items-center grid place-content-center">
        <MemoriesSign className="ml-4" />
      </div>
      <div className="w-full flex items-center">
        <UserDropdown />
        <Bookmark color="#6A6A6A" size={38} />
      </div>
      <div className="mr-6 flex items-center justify-end">
        <RecentAvatarBlock
          img="avatar.jpg"
          text="John Doe"
          classNames={{
            avatar: {
              base: "custom-avatar",
              fallback: "custom-fallback",
              img: "custom-img",
            },
            text: { base: "custom-text" },
          }}
        />
      </div>
    </div>
  );
}
