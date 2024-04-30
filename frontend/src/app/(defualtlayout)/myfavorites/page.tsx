import { RightSidebar } from "@/components/right-sidebar/right-sidebar";
import { LoadMore } from "@/components/favorites-posts/load-more";

export default function MyFavorites() {
  return (
    <>
      <div className="flex flex-col overflow-x-hidden w-[90%] mt-5 md:w-[512px] xl:w-[768px] mx-auto">
        <div className="bg-white rounded-md p-7 mb-5 w-full grid grid-cols-3 gap-2">
          <LoadMore></LoadMore>
        </div>
      </div>
      <div className="my-5 w-[240px] md:flex flex-col gap-4 hidden">
        <RightSidebar className=" bg-white rounded-md w-full  flex p-7 flex-col gap-4" />
        <div className="bg-white rounded-md w-full p-7">
          Будут кастомные виджеты, пока не в приоритете
        </div>
      </div>
    </>
  );
}
