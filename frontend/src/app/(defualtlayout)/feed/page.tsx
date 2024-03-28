import Aside from "@/components/a-side/a-side";
import { RightSidebar } from "@/components/right-sidebar/right-sidebar";
import Button from "@/components/ui/button/Button";

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
      <div className="flex flex-col">
        <div className="bg-white w-[90%] rounded-md p-7 my-5 md:w-[512px] xl:w-[768px] h-[110px] mx-auto">
          <p>
            Блок историй, малый приоритет, пока не разрабатывается. Валера
            поправь Топбар я тебя умоляю
          </p>
        </div>
        <div className="flex gap-4 justify-end my-2 w-[90%] md:w-[512px] xl:w-[768px] h-[110px] mx-auto">
          <Button
            type="button"
            text="Followers"
            className="btn btn-disabled w-[20px]"
            disabled
          />
          <Button
            type="button"
            text="Popular"
            className="btn btn-primary w-[20px]"
          />
        </div>
        <p>ВАЛЕРА ниже ВСТАВЛЯЙ КАРТОЧКИ и также пагинацию по скролу</p>
      </div>
      <div className="my-5 w-[240px] md:flex flex-col gap-4 hidden">
        <RightSidebar
          items={profiles}
          className=" bg-white rounded-md w-full  flex p-7 flex-col gap-4"
        />
        <div className=" bg-white rounded-md w-full p-7 ">
          Будут кастомные виджеты, пока не в приоритете
        </div>
      </div>
    </>
  );
}
