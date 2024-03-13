import React, { useState } from "react";
import Input from "./ui/input/Input";
import { Smile } from "lucide-react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  photo: string;
  addComment: (comment: string) => void; // Функция для добавления комментария в список
};

const CommentInput: React.FC<Props> = ({ photo, addComment }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // Предотвращаем перенос строки
      console.log("Text entered:", inputValue);
      addComment(inputValue); // Добавляем комментарий в список
      setInputValue("");
    } else if (event.key === "Enter" && !event.shiftKey) {
      setInputValue(prevValue => prevValue + "\n"); // Добавляем перенос строки
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="flex mt-4 mb-4">
      <img
        src={photo}
        alt="User photo"
        className="w-[45px] h-[45px] rounded-full"
      />
      <CustomInput
        type="text"
        placeholder="Write your comment..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="ml-4 pl-4 rounded-[10px] w-full bg-[#F9F9F9] border-[#CBCED3] border-[1px]"
      />
      <Button variant="ghost" className="pl-[1px] pr-[1px]">
        <Smile strokeWidth={1.5} size={30} color="#9B9B9B" />
      </Button>
      <Button variant="ghost" className="pl-[1px] pr-[1px]">
        <Image strokeWidth={1.5} size={30} color="#9B9B9B" />
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
