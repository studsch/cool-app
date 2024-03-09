import { Select } from "@/components/ui/select";
import Slider from "@/components/ui/sliders/Slider";
import { Recent } from "@/components/recent/recent";
import MutualFriends from "@/components/mutual-friends/mutual-friends";
// import data from "@/test_data/slider/slider"; // тестовые данные для тестирования слайдера
// import users from "@/test_data/recent/users"; // для тестирования , слайдера и аватаров
import users from "@/test_data/people/users"; // для теста общих друзей
import People from "@/components/people/people";
import DragDropPreview from "@/components/ui/dragdroppreview";
import { Card } from "@/components/ui/card";
import TopBar from "@/components/topbar/topbar";
import PostCard from "@/components/card/card";
import AvatarBlock from "@/components/avatarblock/avatarblock";

export default function DragAndDrop() {
  return (
    <>
      <div>
        <TopBar />
        <AvatarBlock avatarPosition="left" />
        <AvatarBlock avatarPosition="right" />
      </div>
    </>
  );
}
