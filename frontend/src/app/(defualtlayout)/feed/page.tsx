import Aside from "@/components/a-side/a-side";
import PostCard from "@/components/card/card";
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

  const photos = [
    "https://masyamba.ru/леопард-фото/82-леопард-фото-животного.jpg",
    "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666364979_14-mykaleidoscope-ru-p-krasivie-peizazhi-prirodi-oboi-17.jpg",
    "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666361504_9-mykaleidoscope-ru-p-peizazhi-prirodi-krasivo-9.jpg",
    "https://masyamba.ru/леопард-фото/82-леопард-фото-животного.jpg",
    "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666364979_14-mykaleidoscope-ru-p-krasivie-peizazhi-prirodi-oboi-17.jpg",
    "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666361504_9-mykaleidoscope-ru-p-peizazhi-prirodi-krasivo-9.jpg",
    "https://masyamba.ru/леопард-фото/82-леопард-фото-животного.jpg",
    "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666364979_14-mykaleidoscope-ru-p-krasivie-peizazhi-prirodi-oboi-17.jpg",
    "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666361504_9-mykaleidoscope-ru-p-peizazhi-prirodi-krasivo-9.jpg",
  ];

  return (
    <>
      <div className="flex flex-col overflow-x-hidden w-[90%] mt-5 md:w-[512px] xl:w-[768px] mx-auto">
        <div className="bg-white rounded-md p-7 mb-5 w-full">
          <p>Скоро здесь будет блок историй пользователей</p>
        </div>
        <div className="flex gap-4 justify-end my-2">
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
        {/* Оберните блок с постами в контейнер и добавьте стили для скролла */}
        <div className="md:w-[512px] xl:w-[768px] overflow-hidden">
          {photos.map((photo, index) => (
            <PostCard key={index} photo={photo} />
          ))}
        </div>
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
