import React, { useState } from "react";
import CommentInput from "./inputComment";

interface CommentProps {
  name: string;
  photo: string;
  comment: string;
  dateCom: string;
  addReply: (reply: string) => void; // Функция для добавления ответа на комментарий
}

const Comment: React.FC<CommentProps> = ({
  name,
  photo,
  comment,
  dateCom,
  addReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);

  const defaultName = "Default Name";
  const defaultPhoto = "https://example.com/default.jpg";
  const defaultComment = "Default comment";
  const defaultDateCom = "два часа назад";

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleAddReply = (reply: string) => {
    setShowReplyInput(false); // Скрыть поле ввода в ответ на комментарий
    addReply(reply); // Добавить ответ на комментарий
  };

  return (
    <div className="flex mt-4 relative">
      <img
        src={photo || defaultPhoto}
        alt={name || defaultName}
        className="h-[45px] w-[45px] rounded-full"
      />
      <div className="ml-4 w-full">
        <h3 className="font-medium">{name || defaultName}</h3>
        <h3 className="">{comment || defaultComment}</h3>
        <div className="flex items-center">
          <p className="text-sm">{dateCom || defaultDateCom}</p>
          <button
            onClick={handleReplyClick}
            className="ml-2 text-sm text-[#FF75AF]"
          >
            Reply
          </button>
        </div>
        {showReplyInput && (
          <CommentInput
            photo={photo || defaultPhoto}
            addComment={handleAddReply}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
