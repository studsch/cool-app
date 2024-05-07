import React, { useState } from "react";
import CommentInput from "./inputComment";

interface CommentProps {
  name?: string;
  photo: string;
  comment: string;
  dateCom: string;
  addReply: (reply: string, name?: string, avatar?: string) => void; // Функция для добавления ответа на комментарий
}

const CommentC: React.FC<CommentProps> = ({
  name,
  photo,
  comment,
  dateCom,
  addReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleAddReply = (reply: string, name?: string, avatar?: string) => {
    setShowReplyInput(false); // Скрыть поле ввода в ответ на комментарий
    addReply(reply, name, avatar); // Добавить ответ на комментарий
  };

  const dateObject = new Date(dateCom);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  return (
    <div className="flex mt-4 relative mb-4">
      <img
        src={`http://localhost:9000/${photo}`}
        alt={name}
        className="h-[45px] w-[45px] rounded-full object-cover"
      />
      <div className="ml-4 w-full">
        <h3 className="font-medium">{name}</h3>
        <h3 className="">{comment}</h3>
        <div className="flex items-center">
          <p className="text-text-secondary-color">{formattedDate}</p>
          <button
            onClick={handleReplyClick}
            className="ml-2 text-sm text-[#FF75AF]"
          >
            Reply
          </button>
        </div>
        {showReplyInput && (
          <CommentInput photo={photo} addComment={handleAddReply} />
        )}
      </div>
    </div>
  );
};

export default CommentC;
