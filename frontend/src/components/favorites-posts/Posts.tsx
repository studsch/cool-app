import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import PostCard from "../card/card";
import { toNormalDateTime } from "@/lib/utils";
type Props = {
  className?: string;
  classNames?: { wrapper?: string };
  posts?: any[];
  //   user_id?: string;
};
const Searchs: React.FC<Props | any> = props => {
  const { classNames, user_id, restProps } = props;
  return (
    <>
      {props.searchs.length != 0 ? (
        props.searchs.map((search: any) => (
          <div className="flex flex-col" key={search.id}>
            <div className="px-7"></div>
          </div>
        ))
      ) : (
        <p className="h-14 px-7 py-2">No data available</p>
      )}
    </>
  );
};

export default Searchs;
