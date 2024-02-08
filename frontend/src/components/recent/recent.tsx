import RecentAvatarBlock from "../avatarblock/recent-avatar-block";
import users from "@/test_data/recent/users";
import Slider from "../ui/sliders/Slider";
import "./style.scss";

export function Recent() {
  const data: any = users.map((user, index) => {
    return (
      <div>
        <RecentAvatarBlock
          classNames={{ text: { base: "text-[0.9rem]" } }}
          text={user.login}
          img={user.img}
        ></RecentAvatarBlock>
      </div>
    );
  });
  return (
    <div className="w-[300px]">
      <p className="text-lg font-medium text-secondary-color m-4">Recent</p>
      <Slider
        slidesPerView={4}
        spaceBetween={0}
        data={data}
        errMsg="No data"
      ></Slider>
    </div>
  );
}
