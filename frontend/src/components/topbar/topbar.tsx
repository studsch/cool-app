"use client";
import RecentAvatarBlock from "../avatarblock/recent-avatar-block";
import { DropdownMenu } from "../ui/dropdown-menu";
import UserDropdown from "../ui/DropSearchMenu";
import { Bookmark } from "lucide-react";
import Button from "../ui/button/Button";
import MemoriesSign from "../memories-sign/memoriesSign";
import ToggleNavBar from "../toggle-nav-menu/toggle-nav-menu";
import { useResize } from "@/hooks/screens";

export default function TopBar() {
  const width = useResize();
  return (
    <div className="h-[90px] flex ml-[10%] mr-[10%] border-2 rounded-lg overflow-hidden">
      <div className="flex-initial w-[408px] items-center grid place-content-center">
        {width >= 768 ? <MemoriesSign className="ml-4" /> : <ToggleNavBar />}
      </div>
      <div className="w-full flex items-center mr-4">
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
