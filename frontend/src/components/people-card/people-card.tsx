// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// type AvatarProps = {
//   data: {
//     img: string;
//     login: string;
//     name: string;
//     surname: string;
//   }[];
// };
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MutualFriends from "../mutual-friends/mutual-friends";
import AvatarBlock from "../avatarblock/avatarblock";
import users from "@/test_data/people/users";
import AddButton from "./add-button";

const PeopleCard: React.FC = () => {
  return (
    <div className="flex items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="px-3 my-auto">
        <p className="text-sm text-text-primary-color font-medium">
          Spepan Chivchan
        </p>
        <div className="flex">
          <MutualFriends data={users}></MutualFriends>
          <p className="text-sm text-text-secondary-color">4 mutual friends</p>
        </div>
      </div>
      <AddButton data="@stepanlogin" className="my-auto "></AddButton>
    </div>
  );
};

export default PeopleCard;
