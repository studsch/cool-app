"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearch } from "@/store";

import SearchUser from "./search-user";
type Props = {
  className?: string;
  classNames?: { wrapper?: string };
};
const SearchUsers: React.FC<Props | any> = props => {
  const searchs = useSearch(state => state.searchs);
  const { classNames, restProps } = props;
  return (
    <div className={`flex flex-col gap-6 mt-6 ${classNames?.wrapper}`}>
      {searchs.length != 0 ? (
        searchs.map((search: any) => (
          <div className="flex flex-col gap-6" key={search.id}>
            <SearchUser user={search} key={search.id}></SearchUser>
            <hr className="rounded-md border-[#F2F2F2] w-full border-t-2" />
          </div>
        ))
      ) : (
        <p>No users available</p>
      )}
    </div>
  );
};

export default SearchUsers;
