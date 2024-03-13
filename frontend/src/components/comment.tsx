import React from "react";

interface CommentProps {
  name: string;
  photo: string;
  comment: string;
  dateCom: string;
}

const Comment: React.FC<CommentProps> = ({ name, photo, comment, dateCom }) => {
  const defaultName = "Default Name";
  const defaultPhoto = "https://example.com/default.jpg";
  const defaultComment = "Default comment";
  const defaultDateCom = "два часа назад";

  return (
    <div className="flex mt-4">
      <img
        src={photo || defaultPhoto}
        alt={name || defaultName}
        className="h-[45px] w-[45px] rounded-full"
      />
      <div className="ml-4">
        <h3 className="font-medium">{name || defaultName}</h3>
        <h3 className="">{comment || defaultComment}</h3>
        <p className="text-sm">{dateCom || defaultDateCom}</p>
      </div>
    </div>
  );
};

export default Comment;
