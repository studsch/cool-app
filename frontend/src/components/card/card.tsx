"use client";
import React, { useState, useEffect } from "react";

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

import { cn } from "@/lib/utils";
import AvatarBlock from "@/components/avatarblock/avatarblock";
import { MoreHorizontal } from "lucide-react";
import { Image } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Share2 } from "lucide-react";
import { Bookmark } from "lucide-react";
import { AutoComplete } from "@/components/autocomplete/autocomplete";
import CommentC from "../comment";
import CommentInput from "../inputComment";

interface CommentProps {
  author: string;
  avatarURL: string;
  content: string;
  createdAt: string;
}

interface PostCardProps {
  id: string;
  userPhoto: string; // Фотография пользователя
  userName: string; // Имя пользователя
  userSName: string; // Фамилия пользователя
  photo?: string; // Фотография для карточки поста
  description: string; // Описание для карточки поста
  className?: string;
  createdAt: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  userPhoto,
  userName,
  userSName,
  photo,
  description,
  className,
  createdAt,
}) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const [isSaved, setIsSaved] = useState(false);
  const handleSaveClick = () => {
    setIsSaved(!isSaved);
  };

  const handleAddComment = (comment: string) => {
    const newComment: CommentProps = {
      author: "New User",
      avatarURL: userPhoto,
      content: comment,
      createdAt: "Now",
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleAddReply = (reply: string) => {
    // Добавить ответ на комментарий в список
    // В данном случае можно просто добавить ответ в список комментариев
  };

  const dateObject = new Date(createdAt);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const [comments, setComments] = useState<CommentProps[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsUrl = `http://localhost:8000/api/v1/comment/post/${id}?page=1&size=10`;
        const response = await fetch(commentsUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("There was a problem with fetching comments:", error);
      }
    };

    fetchComments();
  }, []);
  return (
    <div className={cn("grid place-content-center mt-4 mb-4", className)}>
      <span className="align-middle">
        <Card className=" w-full border-none shadow-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={userPhoto}
                  alt={userName}
                  className="rounded-full h-[55px] w-[55px] mr-2 object-cover"
                />{" "}
                <div className="grid">
                  <span className="text-text-primary-color">{`${userName} ${userSName}`}</span>
                  <span className="text-text-secondary-color">
                    {formattedDate}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Настройки</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Удалить пост</DropdownMenuItem>
                  <DropdownMenuItem>Пожаловаться(ну ты ябида)</DropdownMenuItem>
                  <DropdownMenuItem>ПотомПридумаем1</DropdownMenuItem>
                  <DropdownMenuItem>ПотомПридумаем2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="md:w-[512px] xl:w-[768px]">
            <div className="flex justify-center items-center overflow-hidden rounded-lg h-[500px] relative">
              <img
                src={photo}
                alt="Post"
                className="object-cover max-w-full max-h-[500px] z-20"
              />
              <img
                src={photo}
                alt="Post"
                className="absolute w-[725px] h-[500px] blur-2xl z-10"
              />
            </div>
            <div className="w-full mt-4 mb-4">
              <p className="text text-secondary-color">{description}</p>
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
              <div className="overflow-hidden w-full ">
                {comments.map((comment, index) => (
                  <CommentC
                    key={index}
                    name={comment.author}
                    photo={comment.avatarURL}
                    comment={comment.content}
                    dateCom={comment.createdAt}
                    addReply={handleAddReply}
                  />
                ))}
              </div>
              <hr></hr>
              <div>
                <CommentInput
                  photo={userPhoto}
                  addComment={handleAddComment}
                  id={id}
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
