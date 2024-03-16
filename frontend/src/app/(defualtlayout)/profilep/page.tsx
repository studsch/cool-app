import { CreatePost } from "@/components/create-post/create-post";
import { Profile } from "@/components/profile/profile";
import {
  ProfileInfo,
  RightSidebar,
} from "@/components/right-sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";
import { Film } from "lucide-react";
import { BookHeart } from "lucide-react";

export default function Home() {
  const profiles: ProfileInfo[] = [
    {
      avatarImage: "https://github.com/shadcn.png",
      avatarFallback: "MP",
      name: "Morty",
      link: "@morty",
    },
    {
      avatarImage:
        "https://i.pinimg.com/736x/6e/51/32/6e5132a90812ad1abf3711135a5cf406.jpg",
      avatarFallback: "RP",
      name: "Rick",
      link: "@rick",
    },

    {
      avatarImage: "https://github.com/shadcn.png",
      avatarFallback: "MP",
      name: "Morty",
      link: "@morty",
    },
    {
      avatarImage:
        "https://i.pinimg.com/736x/6e/51/32/6e5132a90812ad1abf3711135a5cf406.jpg",
      avatarFallback: "RP",
      name: "Rick",
      link: "@rick",
    },

    {
      avatarImage: "https://github.com/shadcn.png",
      avatarFallback: "MP",
      name: "Morty",
      link: "@morty",
    },
    {
      avatarImage:
        "https://i.pinimg.com/736x/6e/51/32/6e5132a90812ad1abf3711135a5cf406.jpg",
      avatarFallback: "RP",
      name: "Rick",
      link: "@rick",
    },
  ];

  const profileInfo = {
    avatarImage: "https://github.com/shadcn.png",
    avatarFallback: "MP",
    name: "Morty",
    description: "There are some description",
  };

  const photos: string[] = [
    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo6.jpg",
    "photo7.jpg",
    "photo8.jpg",
    // Добавьте свои фотографии здесь
  ];

  return (
    <>
      <div>
        <div className="mt-5 mb-5">
          <Profile info={profileInfo} />
        </div>
        <div className="bg-white rounded-xl w-full h-full">
          <div className="flex justify-between ml-[10%] mr-[10%]">
            <Button variant="ghost" className="mt-2 mb-2">
              <Grid3X3 strokeWidth={1.5} size={24} />
            </Button>
            <Button variant="ghost" className="mt-2 mb-2">
              <Film strokeWidth={1.5} size={24} />
            </Button>
            <Button variant="ghost" className="mt-2 mb-2">
              <BookHeart strokeWidth={1.5} size={24} />
            </Button>
          </div>
          <hr className="ml-[5%] mr-[5%]"></hr>
          <div></div>
        </div>
      </div>
      <CreatePost />
    </>
  );
}
