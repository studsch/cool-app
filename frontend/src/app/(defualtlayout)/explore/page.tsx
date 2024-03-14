import SearchForm from "@/components/search-form/search-form";
import SearchUser from "@/components/search-users/search-user";
import SearchUsers from "@/components/search-users/serch-users";
import { LoadMore } from "@/components/search-users/load-more";

export default function Explore() {
  return (
    <>
      <SearchForm>
        <div className="mt-6">
          {/* <SearchUser></SearchUser>
          <hr className="rounded-md border-[#F2F2F2] w-full border-t-2" />
          <SearchUser isSubscribed={true}></SearchUser> */}
          <SearchUsers
            users={[
              { id: 1 },
              { id: 2 },
              { id: 3 },
              { id: 4 },
              { id: 5 },
              { id: 6 },
              { id: 7 },
            ]}
          ></SearchUsers>
          <LoadMore />
        </div>
      </SearchForm>
    </>
  );
}
