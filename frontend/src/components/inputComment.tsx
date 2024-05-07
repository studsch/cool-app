import React, { useState } from "react";
import Input from "./ui/input/Input";
import { Smile } from "lucide-react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

type Props = {
  photo: string;
  id: string;
  addComment: (comment: string, name?: string, avatar?: string) => void; // Функция для добавления комментария в список
  userName: string; // Добавлено новое поле для имени пользователя
};

const CommentInput: React.FC<Props> = ({ photo, id, addComment }) => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");
  const [showSmileMenu, setShowSmileMenu] = useState(false);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // Предотвращаем перенос строки
      addComment(inputValue, session?.user.name, session?.user.avatar); // Добавляем комментарий в список
      await sendComment(inputValue); // Отправляем комментарий
      setInputValue("");
    } else if (event.key === "Enter" && !event.shiftKey) {
      setInputValue(prevValue => prevValue + "\n"); // Добавляем перенос строки
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSmileClick = () => {
    setShowSmileMenu(prevState => !prevState);
  };

  const handleSmileSelect = (smile: string) => {
    setInputValue(prevValue => prevValue + smile);
    setShowSmileMenu(false);
  };

  const sendComment = async (comment: string) => {
    try {
      // Отправляем комментарий на сервер
      const response = await fetch("http://localhost:8000/api/v1/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.tokens.access}`,
        },
        body: JSON.stringify({
          content: comment,
          postId: id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send comment");
      }
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  const smileys = ["😊", "😄", "😁", "😆", "😅", "😂", "🤣", "😉", "😍", "🥰"];

  return (
    <div className="flex mt-4 mb-4 relative">
      <img
        src={photo}
        alt="User photo"
        className="w-[45px] h-[45px] rounded-full object-cover"
      />
      <CustomInput
        type="text"
        placeholder="Write your comment..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="ml-4 pl-4 rounded-[10px] w-full bg-[#F9F9F9] border-[#CBCED3] border-[1px]"
      />
      <Button
        variant="ghost"
        className="absolute bottom-[4px] right-0 pl-[1px] pr-[1px] -translate-x-[40%]"
        onClick={handleSmileClick}
      >
        <Smile strokeWidth={1.5} size={24} color="#9B9B9B" />
      </Button>
      {showSmileMenu && (
        <div className="absolute bottom-[50px] pl-[1px] pr-[1px] right-0 flex flex-wrap bg-white border border-gray-300 p-2 rounded">
          {smileys.map((smile, index) => (
            <button key={index} onClick={() => handleSmileSelect(smile)}>
              {smile}
            </button>
          ))}
        </div>
      )}
      <Button
        variant="ghost"
        className="absolute bottom-[4px] right-0 -translate-x-[160%] pl-[1px] pr-[1px]"
      >
        <Image strokeWidth={1.5} size={24} color="#9B9B9B" />
      </Button>
    </div>
  );
};

const CustomInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  return <input {...props} />;
};

export default CommentInput;
