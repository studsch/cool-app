import SearchForm from "@/components/search-form/search-form";
import SearchUsers from "@/components/search-users/serch-users";
import { LoadMore } from "@/components/search-users/load-more";

export default function Explore() {
  return (
    <>
      <SearchForm>
        {/* <SearchUser></SearchUser>
          <hr className="rounded-md border-[#F2F2F2] w-full border-t-2" />
          <SearchUser isSubscribed={true}></SearchUser> */}
        {/* <SearchUsers></SearchUsers> */}
        <LoadMore />
      </SearchForm>
    </>
  );
}
