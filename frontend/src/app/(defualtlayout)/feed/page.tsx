import Aside from "@/components/a-side/a-side";
import { RightSidebar } from "@/components/right-sidebar/right-sidebar";

export default function Feed() {
  const profiles = [
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
  return (
    <>
      <div className="bg-white w-[90%] rounded-md p-7 my-5 md:w-[512px] xl:w-[768px] h-[110px] mx-auto">
        <p>
          Блок историй, малый приоритет, пока не разрабатывается. Валера поправь
          Топбар я тебя умоляю
        </p>
      </div>
      <Aside minWidth={1280} className="my-5 w-[240px] flex flex-col gap-4">
        <RightSidebar
          items={profiles}
          className=" bg-white rounded-md w-full  flex p-7 flex-col gap-4"
        />
        <div className=" bg-white rounded-md w-full p-7 ">
          Будут кастомные виджеты, пока не в приоритете
        </div>
      </Aside>
    </>
  );
}
