import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarProps = {
  data: {
    img: string;
    login: string;
    name: string;
    surname: string;
  }[];
};

const MutualFriends: React.FC<AvatarProps> = props => {
  return (
    <div className="flex ml-[5px]">
      {props.data.map((user, index) => {
        return (
          <Avatar
            className={"h-5 w-5 ml-[-5px] border-solid border-1 border-white"}
            key={index}
          >
            <AvatarImage src={user.img} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );
};

// RecentAvatarBlock.defaultProps = {
//   classNames: {
//     avatar: { base: "", fallback: "", img: "" },
//     text: { base: "" },
//   },
// };
export default MutualFriends;
