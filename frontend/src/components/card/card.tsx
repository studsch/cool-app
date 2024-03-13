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

  const commentsData = [
    {
      name: "User1",
      photo:
        "https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg",
      comment: "Comment 1",
      dateCom: "Today",
    },
    {
      name: "User2",
      photo:
        "https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg",
      comment: "Comment 2",
      dateCom: "Yesterday",
    },
    {
      name: "User3",
      photo:
        "https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg",
      comment: "Comment 2",
      dateCom: "Yesterday",
    },
    {
      name: "User4",
      photo:
        "https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg",
      comment: "Comment 2",
      dateCom: "Yesterday",
    },
    {
      name: "User5",
      photo:
        "https://i.pinimg.com/originals/d9/8b/54/d98b54932c071ceb6f95fbd5439e7da7.jpg",
      comment: "Comment 2",
      dateCom: "Yesterday",
    },
    // Добавьте другие комментарии
  ];

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

  return (
    <div className="grid place-content-center">
      <span className="align-middle">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="grid place-content-center">
                <AvatarBlock avatarPosition="right" />
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
                  <div className="flex">
                    <div className="grid place-content-left">
                      <Heart
                        color={isLiked ? "#FF60A3" : "black"}
                        fill={isLiked ? "#FF60A3" : "white"}
                      />
                    </div>
                    <div className="pl-2 grid place-content-left">
                      <div className="text-black">Like</div>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost">
                  <div className="flex">
                    <div className="grid place-content-left">
                      <MessageCircle />
                    </div>
                    <div className="pl-2 grid place-content-left">
                      <div className="text-black">Comment</div>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost">
                  <div className="flex">
                    <div className="grid place-content-left">
                      <Share2 />
                    </div>
                    <div className="pl-2 grid place-content-left">
                      <div className="text-black">Share</div>
                    </div>
                  </div>
                </Button>
                <Button variant="ghost" onClick={handleSaveClick}>
                  <div className="flex">
                    <div className="grid place-content-left">
                      <Bookmark color={isSaved ? "#FF60A3" : "black"} />
                    </div>
                    <div className="pl-2 grid place-content-left">
                      <div className="text-black">Save</div>
                    </div>
                  </div>
                </Button>
              </div>
              <div className="overflow-hidden w-full">
                {showAllComments ? (
                  commentsData.map((comment, index) => (
                    <Comment key={index} {...comment} />
                  ))
                ) : (
                  <Comment {...commentsData[0]} />
                )}
                {!showAllComments && !hideAllComments && (
                  <button
                    onClick={handleShowAllClick}
                    className="text-[#FF75AF]"
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
            </div>
          </CardFooter>
        </Card>
      </span>
    </div>
  );
};

export default PostCard;
