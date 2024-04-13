"use client";
import React, { useState } from "react";
import PhotoGrid from "@/components/mediaProfile";
import { useSession } from "next-auth/react";
import { Profile } from "@/components/profile/profile";
import {
  ProfileInfo,
  RightSidebar,
} from "@/components/right-sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";
import { Film } from "lucide-react";
import { BookHeart } from "lucide-react";
import CreatePost from "@/components/ui/create-post";
import UserWidget from "@/components/ui/userwidget";

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);

  const profiles: ProfileInfo[] = [
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

  const handleCreatePost = (photo: File, description: string) => {
    console.log("Created Post:", photo, description);
    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = () => {
      setPhotos([...photos, reader.result as string]);
    };
  };

  interface ProfileProps {
    info: {
      avatarImage: string;
      avatarFallback: string;
      name: string;
      description: string;
    };
  }

  const userPhoto = "https://example.com/user_photo.jpg";
  const userName = "John";
  const userLastName = "Doe";
  const friends = [
    { id: 1, name: "Jane", lastName: "Smith" },
    { id: 2, name: "Alice", lastName: "Johnson" },
    { id: 3, name: "Bob", lastName: "Brown" },
  ];

  const { data: session, status, update } = useSession();

  const postId = "15ac316b-d68f-41e6-9d44-b56550a3b26b"; // Замените на реальный id поста

  fetch(`http://localhost:8000/api/v1/post/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Добавьте любые необходимые заголовки, например, авторизацию
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(postData => {
      // В переменной postData будет содержаться информация о посте
      console.log("Post Data:", postData);
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });

  return (
    <>
      <div>
        {/* <div className="app">
          <UserWidget
            userPhoto={userPhoto}
            userName={userName}
            userLastName={userLastName}
            friends={friends}
          />
        </div> */}
        <div className="mt-5 mb-5">
          <Profile info={profileInfo} />
        </div>
        <div className="bg-white rounded-xl w-full h-[50px] mt-4 mb-4 flex place-content-center justify-between">
          <div className="h-full grid content-center">
            <p className="text text-secondary-color mr-4 ml-4">
              Поделитесь вашими свежими воспоминаниями!
            </p>
          </div>
          <div className="mr-4 ml-4">
            <CreatePost onCreatePost={handleCreatePost} session={session} />
          </div>
        </div>
        <div className="bg-white rounded-xl w-full">
          <div className="flex justify-between ml-[10%] mr-[10%]">
            <Button variant="ghost" className="mt-2 mb-2">
              <Grid3X3 strokeWidth={1.5} size={24} />
            </Button>
            <Button variant="ghost" className="mt-2 mb-2">
              <Film strokeWidth={1.5} size={24} />
            </Button>
            <Button variant="ghost" className="mt-2 mb-2">
              <BookHeart strokeWidth={1.5} size={24} />
            </Button>
          </div>
          <hr className="ml-[2%] mr-[2%]"></hr>
          <div className="ml-2 mr-2 mt-4 w-[600px]  flex flex-wrap ">
            <PhotoGrid photos={photos} />
          </div>
        </div>
      </div>
    </>
  );
}
