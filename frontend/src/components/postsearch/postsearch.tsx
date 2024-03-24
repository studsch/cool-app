import React from "react";

interface PostProps {
  photo: string;
  name: string;
  text: string;
  avatarImg: string;
}

const Post: React.FC<PostProps> = ({ photo, name, text, avatarImg }) => {
  return (
    <div className="mx-4 mb-6">
      {/* <p className="text-lg font-medium text-text-primary-color my-4"></p> */}
      <div className="flex">
        <div className="mr-4">
          <img
            src={photo}
            alt="Post"
            className="w-[65px] h-[65px] rounded-lg object-cover"
          />
        </div>
        <div className="grid content-start h-[70px] my-auto">
          <div className="mb-1">
            <p className="text-sm text-text-primary-color font-medium">
              {name}
            </p>
          </div>
          <div className="text-sm text-text-primary-color font-medium w-[170px] overflow-hidden">
            {text}
          </div>
        </div>
        <div className="grid content-center">
          <img
            src={avatarImg}
            alt="Avatar"
            className="w-10 h-10 rounded-full self-end"
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
