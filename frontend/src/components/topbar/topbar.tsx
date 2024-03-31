import RecentAvatarBlock from "../avatarblock/recent-avatar-block";
import { DropdownMenu } from "../ui/dropdown-menu";
import UserDropdown from "../ui/DropSearchMenu";
import { Bookmark } from "lucide-react";
import Button from "../ui/button/Button";
import MemoriesSign from "../memories-sign/memoriesSign";
import ToggleNavBar from "../toggle-nav-menu/toggle-nav-menu";

export default function TopBar() {
  return (
    <div className="bg-white rounded-md fixed z-50 w-[100vw] h-unit-18 my-auto ">
      <div className="w-[90%] sm:w-[512px] md:w-[768px] xl:w-[1280px]  flex items-center h-full mx-auto  sm:px-[18px] md:px-[24px] xl:px-[20px] overflow-hidden">
        <div className="">
          <MemoriesSign className="xl:flex hidden w-[218px]" />
          <ToggleNavBar className="block xl:hidden w-[18px]" />
        </div>
        <div className="w-full flex items-center ">
          <UserDropdown />
          <Bookmark color="#6A6A6A" size={38} />
        </div>

        <RecentAvatarBlock
          img="avatar.jpg"
          text="John Doe"
          classNames={{
            text: { base: "sm:w-[150px]" },
          }}
        />
      </div>
    </div>
  );
}
