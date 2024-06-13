"use client";
import PhotoGrid from "@/components/mediaProfile";
import { Profile } from "@/components/profile/profile";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";
import { Film } from "lucide-react";
import { BookHeart } from "lucide-react";
import CreatePost from "@/components/ui/create-post";
import UserWidget from "@/components/ui/userwidget";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);

  const { data: session, status, update } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  const profileInfo = {
    avatarImage: "https://github.com/shadcn.png",
    avatarFallback: "MP",
    name: "Morty",
    description: "There are some description",
  };

  const handleCreatePost = (photo: File, description: string) => {
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
      surname: string;
      description: string;
      city: string;
      country: string;
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
  console.log(session);
  const { user } = session;
  const { firstName, lastName, about, city, country } = user;
  return (
    <>
      <div>
        <div className="mt-5 mb-5">
          <Profile
            info={{
              avatarImage: `http://localhost:9000/${session?.user.avatar}`,
              avatarFallback: "JD", // Инициалы пользователя, если нет изображения
              name: firstName,
              surname: lastName,
              description: about,
              city: city,
              country: country,
            }}
          />
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
            <PhotoGrid />
          </div>
        </div>
      </div>
    </>
  );
}
