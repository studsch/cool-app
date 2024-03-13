"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AvatarBlock from "@/components/avatarblock/avatarblock";
import { MoreHorizontal } from "lucide-react";
import { Image } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Share2 } from "lucide-react";
import { Bookmark } from "lucide-react";
import { AutoComplete } from "@/components/autocomplete/autocomplete";
import Comment from "../comment";
import CommentInput from "../inputComment";

interface CommentProps {
  name: string;
  photo: string;
  comment: string;
  dateCom: string;
}

const PostCard: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const [isSaved, setIsSaved] = useState(false);
  const handleSaveClick = () => {
    setIsSaved(!isSaved);
  };

  const [commentsData, setCommentsData] = useState([
    {
      name: "User1",
      photo:
        "https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg",
      comment: "Comment 1",
      dateCom: "Today",
    },
    // Другие комментарии
  ]);

  const addComment = (comment: string) => {
    setCommentsData(prevComments => [
      ...prevComments,
      {
        name: "New User",
        photo: "https://example.com/newuser.jpg",
        comment: comment,
        dateCom: "Now",
      },
    ]);
  };

  const [showAllComments, setShowAllComments] = useState(false);
  const [hideAllComments, setHideAllComments] = useState(false);

  const handleShowAllClick = () => {
    setShowAllComments(true);
    setHideAllComments(false);
  };

  const handleHideAllClick = () => {
    setShowAllComments(false);
    setHideAllComments(true);
  };

  const handleAddReply = (reply: string) => {
    // Добавить ответ на комментарий в список
    // В данном случае можно просто добавить ответ в список комментариев
    setCommentsData(prevComments => [
      ...prevComments,
      {
        name: "New User", // Имя пользователя, отвечающего на комментарий
        photo: "https://example.com/newuser.jpg", // Фото пользователя
        comment: reply, // Текст ответа
        dateCom: "Now", // Дата ответа
      },
    ]);
  };

  return (
    <div className="grid place-content-center">
      <span className="align-middle">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="grid place-content-center ">
                <AvatarBlock avatarPosition="card" className="" />
              </div>
              <div className="grid place-content-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Repost</DropdownMenuItem>
                    <DropdownMenuItem>Don't show this content</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid place-content-center">
              <Image
                width={510}
                alt="NextUI hero Image"
                src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid w-full">
              <div className="flex justify-between w-full">
                <Button variant="ghost" onClick={handleLikeClick}>
                  <div className="flex items-center">
                    <div>
                      <Heart
                        color={isLiked ? "#FF60A3" : "#9B9B9B"}
                        fill={isLiked ? "#FF60A3" : "white"}
                        strokeWidth={1.5}
                        size={24}
                      />
                    </div>
                    <div className="pl-2">
                      <div className="text text-primary-color text-center">
                        Like
                      </div>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost">
                  <div className="flex items-center">
                    <div className="">
                      <MessageCircle
                        strokeWidth={1.5}
                        size={24}
                        color="#9B9B9B"
                      />
                    </div>
                    <div className="pl-2">
                      <div className="text text-primary-color text-center">
                        Comment
                      </div>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost">
                  <div className="flex items-center">
                    <div className="">
                      <Share2 strokeWidth={1.5} size={24} color="#9B9B9B" />
                    </div>
                    <div className="pl-2 ">
                      <div className="text text-primary-color text-center">
                        Share
                      </div>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost" onClick={handleSaveClick}>
                  <div className="flex items-center">
                    <div className="">
                      <Bookmark
                        color={isSaved ? "#FF60A3" : "#9B9B9B"}
                        strokeWidth={1.5}
                        size={24}
                      />
                    </div>
                    <div className="pl-2">
                      <div className="text text-primary-color text-center">
                        Save
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
              <hr></hr>
              <div className="overflow-hidden w-full">
                {showAllComments ? (
                  commentsData.map((comment, index) => (
                    <Comment
                      key={index}
                      {...comment}
                      addReply={handleAddReply}
                    />
                  ))
                ) : (
                  <Comment {...commentsData[0]} addReply={handleAddReply} />
                )}
                {!showAllComments && !hideAllComments && (
                  <button
                    onClick={handleShowAllClick}
                    className="text-[#FF75AF] mt-4"
                  >
                    Show All
                  </button>
                )}
                {showAllComments && (
                  <button
                    onClick={handleHideAllClick}
                    className="text-[#FF75AF] mt-4"
                  >
                    Hide All
                  </button>
                )}
                {!showAllComments && hideAllComments && (
                  <button
                    onClick={handleShowAllClick}
                    className="text-[#FF75AF] mt-4"
                  >
                    Show All
                  </button>
                )}
              </div>
              <hr></hr>
              <div>
                <CommentInput
                  photo="https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg"
                  addComment={addComment}
                />
              </div>
            </div>
          </CardFooter>
        </Card>
      </span>
    </div>
  );
};

export default PostCard;
