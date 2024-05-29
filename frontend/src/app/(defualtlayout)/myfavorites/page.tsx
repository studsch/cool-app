import { RightSidebar } from "@/components/right-sidebar/right-sidebar";
import { LoadMore } from "@/components/favorites-posts/load-more";
import FavoriteWidget from "@/components/favorite-widget/favorite-widget";

export default function MyFavorites() {
  return (
    <>
      <div className="flex flex-col overflow-x-hidden w-[90%] mt-5 md:w-[512px] xl:w-[768px] mx-auto">
        <LoadMore></LoadMore>
      </div>
      <div className="my-5 w-[240px] md:flex flex-col gap-4 hidden">
        <RightSidebar className=" bg-white rounded-md w-full  flex p-7 flex-col gap-4" />
        <FavoriteWidget className="bg-white rounded-md w-full p-7 hidden md:flex flex-col gap-2"></FavoriteWidget>
        <div className="bg-white rounded-md w-full p-7">
          Будут кастомные виджеты, пока не в приоритете
        </div>
      </div>
    </>
  );
}
