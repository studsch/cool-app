"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearch } from "@/store";

import SearchUser from "./search-user";
import { Spinner } from "@nextui-org/react";
type Props = {
  className?: string;
  classNames?: { wrapper?: string };
  searchs?: any[];
};
const SearchUsers: React.FC<Props | any> = props => {
  const { classNames, restProps } = props;
  return (
    <div className={`flex flex-col gap-6 mt-6 ${classNames?.wrapper}`}>
      {props.searchs.length != 0 ? (
        props.searchs.map((search: any) => (
          <div className="flex flex-col gap-6" key={search.id}>
            <SearchUser user={search} key={search.id}></SearchUser>
            <hr className="rounded-md border-[#F2F2F2] w-full border-t-2" />
          </div>
        ))
      ) : (
        <p className="h-14">No users available</p>
      )}
    </div>
  );
};

export default SearchUsers;
