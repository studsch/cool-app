"use client";
import React, { useState, useEffect } from "react";
import PostCard from "@/components/card/card";
import Button from "@/components/ui/button/Button";
import Aside from "@/components/a-side/a-side";
import { RightSidebar } from "@/components/right-sidebar/right-sidebar";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  description: string;
  location: string;
  imageURLs?: string[];
  userAvatar: string; // Фотография пользователя
  userFirstName: string; // Имя пользователя
  userLastName: string; // Фамилия пользователя
  createdAt: string; // Дата публикации
}

interface CommentProps {
  author: string;
  photo: string;
  comment: string;
  dateCom: string;
}

export default function Feed() {
  const { data: session } = useSession();
  const profiles = [
    {
      avatarImage: "https://github.com/shadcn.png",
      avatarFallback: "MP",
      name: "Morty",
      link: "@morty",
    },
    {
      avatarImage:
        "https://i.pinimg.com/736x/6e/51/32/6e5132a90812ad1abf3711135a5cf406.jpg",
      avatarFallback: "RP",
      name: "Rick",
      link: "@rick",
    },
    {
      avatarImage: "https://github.com/shadcn.png",
      avatarFallback: "MP",
      name: "Morty",
      link: "@morty",
    },
    {
      avatarImage:
        "https://i.pinimg.com/736x/6e/51/32/6e5132a90812ad1abf3711135a5cf406.jpg",
      avatarFallback: "RP",
      name: "Rick",
      link: "@rick",
    },
    {
      avatarImage: "https://github.com/shadcn.png",
      avatarFallback: "MP",
      name: "Morty",
      link: "@morty",
    },
    {
      avatarImage:
        "https://i.pinimg.com/736x/6e/51/32/6e5132a90812ad1abf3711135a5cf406.jpg",
      avatarFallback: "RP",
      name: "Rick",
      link: "@rick",
    },
  ];

  const profileInfo = {
    avatarImage: "https://github.com/shadcn.png",
    avatarFallback: "MP",
    name: "Morty",
    description: "There are some description",
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [pageSize, setPageSize] = useState<number>(30);
  const [comments, setComments] = useState<Comment[]>([]);
  console.log(comments);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/post?size=10",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.tokens.access}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data.posts);
        setPageSize(data.size);
      } catch (error) {
        console.error("There was a problem with fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col overflow-x-hidden w-[90%] mt-5 md:w-[512px] xl:w-[768px] mx-auto">
        <div className="bg-white rounded-md p-7 mb-5 w-full">
          <p>Скоро здесь будет блок историй пользователей</p>
        </div>
        <div className="flex gap-4 justify-end my-2">
          <Button
            type="button"
            text="Followers"
            className="btn btn-disabled w-[20px]"
            disabled
          />
          <Button
            type="button"
            text="Popular"
            className="btn btn-primary w-[20px]"
          />
        </div>
        <div className="md:w-[512px] xl:w-[768px] overflow-hidden">
          {posts.slice(0, pageSize).map(post => (
            <PostCard
              key={post.id}
              photo={`http://localhost:9000/${
                post.imageURLs ? post.imageURLs[0] : ""
              }`}
              id={post.id}
              description={post.description}
              userPhoto={`http://localhost:9000/${post.userAvatar}`}
              userName={post.userFirstName}
              userSName={post.userLastName}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      </div>
      <div className="my-5 w-[240px] md:flex flex-col gap-4 hidden">
        <RightSidebar className=" bg-white rounded-md w-full  flex p-7 flex-col gap-4" />
        <div className="bg-white rounded-md w-full p-7">
          Будут кастомные виджеты, пока не в приоритете
        </div>
      </div>
    </>
  );
}
