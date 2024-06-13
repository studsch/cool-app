"use client";
import Link from "next/link";
import { useState } from "react";
import RecentAvatarBlock from "../avatarblock/recent-avatar-block";
import { DropdownMenu } from "../ui/dropdown-menu";
import UserDropdown from "../ui/DropSearchMenu";
import { Bookmark } from "lucide-react";
import Button from "../ui/button/Button";
import MemoriesSign from "../memories-sign/memoriesSign";
import ToggleNavBar from "../toggle-nav-menu/toggle-nav-menu";
import { useSession } from "next-auth/react";

export default function TopBar() {
  const { data: session } = useSession();
  const userName =
    session && session.user
      ? `${session.user.name} ${session.user.surname}`
      : "Guest";

  return (
    <div className="bg-white rounded-md fixed z-50 w-[100vw] h-unit-18 my-auto top-[-2px]">
      <div className="w-[90%] sm:w-[512px] md:w-[768px] xl:w-[1280px] flex items-center h-full mx-auto sm:px-[18px] md:px-[24px] xl:px-[20px] overflow-hidden">
        <div className="">
          <MemoriesSign className="xl:flex hidden w-[218px]" />
          <ToggleNavBar className="block xl:hidden w-[18px]" />
        </div>
        <div className="w-full flex items-center ">
          <UserDropdown />
          <Bookmark color="#6A6A6A" size={38} />
        </div>
        {session && session.user ? (
          <Link
            href="/profilep"
            className="flex items-center rounded-lg text-lg text-[#ff60a3] pl-1 pr-1 pt-1 pb-1 hover:bg-[#ff60a3] hover:text-white"
          >
            <RecentAvatarBlock
              img={`http://localhost:9000/${session.user.avatar}`}
              text={`@${session.user.firstName} ${session.user.lastName}`}
              classNames={{
                text: { base: "sm:w-[200px]" },
              }}
            />
          </Link>
        ) : (
          <RecentAvatarBlock
            img="default-avatar.jpg"
            text="Guest"
            classNames={{
              text: { base: "sm:w-[150px]" },
            }}
          />
        )}
      </div>
    </div>
  );
}
