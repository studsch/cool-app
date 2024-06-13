import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SearchUser from "./search-user";
import PostCard from "../card/card";
import { useTranslations } from "next-intl";
type Props = {
  className?: string;
  classNames?: { wrapper?: string };
  searchs?: any[];
  type: string;
  user_id?: string;
};
const Searchs: React.FC<Props | any> = props => {
  const t = useTranslations("SearchCard");
  const { classNames, user_id, restProps } = props;
  return (
    <div className={`flex flex-col mt-3 ${classNames?.wrapper}`}>
      {props.searchs.length != 0 ? (
        props.searchs.map((search: any) => (
          <div className="flex flex-col" key={search.id}>
            {props.type == "users" ? (
              <div className="px-7">
                <SearchUser
                  user={search}
                  key={search.id}
                  user_id={user_id}
                ></SearchUser>
                <hr className="rounded-md border-[#F2F2F2] w-full border-t-2 my-6" />
              </div>
            ) : (
              // (console.log(toNormalDateTime(search.createdAt)),
              // (console.log(search),
              <div className="relative">
                <div className="absolute bg-gradient-gray-end h-12 -top-10 w-full z-0"></div>
                <PostCard
                  content={[]}
                  photo={
                    search?.imageURLs?.length > 0 &&
                    process.env.MINIO_PUBLIC_DOMEN_URL
                      ? process.env.MINIO_PUBLIC_DOMEN_URL + search.imageURLs[0]
                      : ""
                  }
                  className="mt-1 mb-6 rounded-md z-10 relative"
                  userName={search.userFirstName}
                  userSName={search.userLastName}
                  description={search.description}
                  createdAt={search.createdAt}
                  key={search.id}
                  userPhoto={
                    process.env.MINIO_PUBLIC_DOMEN_URL
                      ? process.env.MINIO_PUBLIC_DOMEN_URL + search.userAvatar
                      : ""
                  }
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="h-14 px-7 py-2">{t("notFoundTitle")}</p>
      )}
    </div>
  );
};

export default Searchs;
