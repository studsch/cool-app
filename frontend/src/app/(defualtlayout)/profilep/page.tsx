import { CreatePost } from "@/components/create-post/create-post";
import PhotoGrid from "@/components/mediaProfile";
import { Profile } from "@/components/profile/profile";
import {
  ProfileInfo,
  RightSidebar,
} from "@/components/right-sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";
import { Film } from "lucide-react";
import { BookHeart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const photos = [
    "https://basetop.ru/wp-content/uploads/2018/06/35ecf3wk.jpg",
    "https://www.zastavki.com/pictures/originals/2018_Model_of_Kara_Delevin_posing_on_camera_127982_.jpg",
    "https://new-world-rpg.ru/wp-content/uploads/4/4/6/44693ea85e742af772255fc0cbe328f8.jpeg",
    "https://udivitelnimir.com/wp-content/uploads/2020/12/1465472467-natalya-vodyanova.jpg",
    "https://i.pinimg.com/originals/f8/93/fb/f893fb534cd1dc744decdd060790186a.jpg",
    "https://mykaleidoscope.ru/uploads/posts/2022-06/1656452922_55-mykaleidoscope-ru-p-svetlo-rusie-ottenki-volos-devushka-krasiv-56.jpg",
    "https://i.pinimg.com/736x/2d/8a/fd/2d8afdf622cca4ba2d1919f8b16ab8ae.jpg",
    "https://howstar.ru/i/womenzar/MirandaKerr/MirandaKerr9585.jpg",
    "https://i.pinimg.com/originals/f8/93/fb/f893fb534cd1dc744decdd060790186a.jpg",
    "https://mykaleidoscope.ru/uploads/posts/2022-06/1656452922_55-mykaleidoscope-ru-p-svetlo-rusie-ottenki-volos-devushka-krasiv-56.jpg",
    "https://i.pinimg.com/736x/2d/8a/fd/2d8afdf622cca4ba2d1919f8b16ab8ae.jpg",
    "https://howstar.ru/i/womenzar/MirandaKerr/MirandaKerr9585.jpg",
    "https://howstar.ru/i/womenzar/MirandaKerr/MirandaKerr9585.jpg",
    "https://i.pinimg.com/originals/f8/93/fb/f893fb534cd1dc744decdd060790186a.jpg",
    "https://mykaleidoscope.ru/uploads/posts/2022-06/1656452922_55-mykaleidoscope-ru-p-svetlo-rusie-ottenki-volos-devushka-krasiv-56.jpg",
    "https://i.pinimg.com/736x/2d/8a/fd/2d8afdf622cca4ba2d1919f8b16ab8ae.jpg",
    "https://howstar.ru/i/womenzar/MirandaKerr/MirandaKerr9585.jpg",

    // Добавьте свои фотографии здесь
  ];

  interface ProfileProps {
    info: {
      avatarImage: string;
      avatarFallback: string;
      name: string;
      description: string;
    };
  }

  return (
    <>
      <div>
        <div className="mt-5 mb-5">
          <Profile info={profileInfo} />
        </div>
        <div className="bg-white rounded-xl w-full h-[50px] mt-4 mb-4 flex place-content-center">
          <CreatePost />
        </div>
        <div className="bg-white rounded-xl w-full">
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
          <hr className="ml-[2%] mr-[2%]"></hr>
          <div className="ml-2 mr-2 mt-4 w-[600px]  flex flex-wrap ">
            <PhotoGrid photos={photos} />
          </div>
        </div>
      </div>
    </>
  );
}
