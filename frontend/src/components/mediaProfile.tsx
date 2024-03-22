"use client";
import React, { useState } from "react";
import { Card } from "./ui/card";
import PostCard from "./card/card";

type PhotoGridProps = {
  photos: string[];
};
type User = {
  name: string;
  avatarPhoto: string;
};

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const openPopup = (photo: string) => {
    setSelectedPhoto(photo);
  };

  const closePopup = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="flex flex-wrap">
      {photos.map((photo, index) => (
        <div
          key={index}
          onClick={() => openPopup(photo)}
          className="cursor-pointer"
        >
          <img
            src={photo}
            className="w-[192px] h-[256px] ml-1 mr-1 mt-1 mb-1 object-cover rounded-sm"
            alt={`Photo ${index + 1}`}
          />
        </div>
      ))}

      {selectedPhoto && (
        <div
          className="fixed top-0 left-0 z-50 w-full h-full  flex items-center justify-center bg-[#9A9A9A] bg-opacity-50"
          onClick={closePopup}
        >
          <PostCard />
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
