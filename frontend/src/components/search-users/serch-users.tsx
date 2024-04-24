import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SearchUser from "./search-user";
import PostCard from "../card/card";
import { toNormalDateTime } from "@/lib/utils";
type Props = {
  className?: string;
  classNames?: { wrapper?: string };
  searchs?: any[];
  type: string;
};
const Searchs: React.FC<Props | any> = props => {
  const { classNames, restProps } = props;
  return (
    <div className={`flex flex-col gap-6 mt-6 ${classNames?.wrapper}`}>
      {props.searchs.length != 0 ? (
        props.searchs.map((search: any) => (
          <div className="flex flex-col gap-6" key={search.id}>
            {props.type == "users" ? (
              <SearchUser user={search} key={search.id}></SearchUser>
            ) : (
              (console.log(toNormalDateTime(search.createdAt)),
              (
                <PostCard
                  photo="https://otvet.imgsmail.ru/download/875a8375f91de049494d6073098e8a2f_a06ff8bf0588f1f51c17b473adc19689.jpg"
                  className=""
                  userName={search.userFirstName}
                  userSName={search.userLastName}
                  description={search.description}
                  createdAt={search.createdAt}
                  key={search.id}
                  userPhoto=""
                />
              ))
            )}
            <hr className="rounded-md border-[#F2F2F2] w-full border-t-2" />
          </div>
        ))
      ) : (
        <p className="h-14">No data available</p>
      )}
    </div>
  );
};

export default Searchs;
