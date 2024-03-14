import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SearchUser from "./search-user";
type Props = {
  className?: string;
  users: [] | null;
  classNames?: { wrapper?: string };
};
const SearchUsers: React.FC<Props | any> = props => {
  const { classNames, users, restProps } = props;
  return (
    <div className={`mt-6 flex flex-col gap-6 ${classNames?.wrapper}`}>
      {users ? (
        users.map((user: any) => (
          <div className="flex flex-col gap-6" key={user.id}>
            <SearchUser user={user} key={user.id}></SearchUser>
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
