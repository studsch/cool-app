import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeFirstLetter } from "@/lib/utils";
import SubscribeButton from "../subscibe-button/subscribe-button";

type Props = {
  className?: string;
  open?: boolean;
  setOpen?: () => {};
  src?: string;
  user?: {};
  login?: string;
  name?: string;
  surname?: string;
  country?: string;
  city?: string;
  description?: string;
  pubs?: string;
  subscribers?: string;
  subscriptions?: string;
  isSubscribed?: boolean;
  classNames?: { img?: string; wrapper?: string };
  fallback?: string;
};
const SearchUser: React.FC<Props | any> = props => {
  const {
    classNames,
    user,
    src = "https://cs1.livemaster.ru/storage/8b/8d/f315028d963e6ce95dd0099c46ub--kartiny-i-panno-kartina-kruglaya-abstraktsiya-novaya-luna.jpg",
    fallback = "fb",
    login = "Login",
    name = "Name",
    surname = "Surname",
    country = "Russia",
    city = "City",
    description = "Description",
    pubs = "141",
    subscribers = "4010",
    subscriptions = "1256",
    isSubscribed = false,
    restProps,
  } = props;
  return (
    console.log(user),
    (
      <div className={`flex items-center ${classNames?.wrapper}`}>
        <Avatar
          className={`w-[100px] h-[100px] xl:w-[160px] xl:h-[160px] ${classNames?.img}`}
        >
          <AvatarImage src={src} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <div className="flex gap-4 mb-1">
            <div>
              <h4 className="text-text-primary-color text-lg font-medium xl:mb-2">
                {login}
              </h4>
              <div className="flex flex-col xl:flex-row xl:gap-2">
                <h5 className="text-black text-sm truncate ... w-[20vw] md:w-[140px] xl:max-w-[180px] xl:w-auto">
                  {capitalizeFirstLetter(user.firstName)}{" "}
                  {capitalizeFirstLetter(user.lastName)}
                </h5>
                <h5 className="text-text-secondary-color font-normal text-sm">
                  {country}, {city}
                </h5>
              </div>
            </div>
            <SubscribeButton isSubscribed={isSubscribed} />
          </div>
          <p className="text-text-secondary-color text-sm font-normal line-clamp-2">
            {description}
          </p>
          <div className="hidden gap-5 mt-4 xl:flex">
            <p className="text-text-primary-color text-sm font-medium hover:underline">
              {pubs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              Publications
            </p>
            <p className="text-text-primary-color text-sm font-medium hover:underline">
              {subscribers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              Subscribers
            </p>
            <p className="text-text-primary-color text-sm font-medium hover:underline">
              {subscriptions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              Subscriptions
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default SearchUser;
