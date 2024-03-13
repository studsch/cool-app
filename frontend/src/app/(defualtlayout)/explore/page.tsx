import SearchForm from "@/components/search-form/search-form";
import SearchUser from "@/components/search-users/search-users";
export default function Explore() {
  return (
    <>
      <SearchForm>
        <div className="mt-6 flex flex-col gap-6">
          <SearchUser></SearchUser>
          <hr className="rounded-md border-[#F2F2F2] w-full border-t-2" />
          <SearchUser isSubscribed={true}></SearchUser>
        </div>
      </SearchForm>
    </>
  );
}
