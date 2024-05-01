import { DialogPostPrewie } from "../cards/dialog-post-prewie";
import PostCard from "../card/card";
import { toNormalDateTime } from "@/lib/utils";
import { buffer } from "stream/consumers";
import Image from "next/image";
type Props = {
  className?: string;
  classNames?: { wrapper?: string };
  posts?: any[];
  //   user_id?: string;
};
const Post: React.FC<Props | any> = props => {
  const { classNames, restProps } = props;
  return (
    <>
      {props.posts && props.posts.length != 0 ? (
        props.posts.map((post: any, index: number) => {
          let tmp = null;
          post.imageURLs
            ? (tmp = (
                // превью для
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg cursor-pointer">
                  <Image
                    src={
                      process.env.MINIO_PUBLIC_DOMEN_URL
                        ? process.env.MINIO_PUBLIC_DOMEN_URL + post.imageURLs[0]
                        : ""
                    }
                    alt={post.description.slice(0, 10)}
                    fill
                    className="rounded-md object-cover absolute blur-lg"
                  ></Image>
                  <Image
                    src={
                      process.env.MINIO_PUBLIC_DOMEN_URL
                        ? process.env.MINIO_PUBLIC_DOMEN_URL + post.imageURLs[0]
                        : ""
                    }
                    alt={post.description.slice(0, 10)}
                    fill
                    className="rounded-md object-scale-down"
                  ></Image>
                </div>
              ))
            : (tmp = (
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg cursor-pointer">
                  <div className="absolute z-0 w-full h-full bg-background-color-reg-light-gray"></div>
                  <p className="text-text-primary-color font-medium flex relative z-10 justify-center items-center h-full">
                    {post.description}
                  </p>
                </div>
              ));
          return (
            <div key={index}>
              <DialogPostPrewie trigger={tmp}></DialogPostPrewie>
            </div>
          );
        })
      ) : (
        <p className="h-14 px-7 py-2">No data available</p>
      )}
    </>
  );
};

export default Post;
