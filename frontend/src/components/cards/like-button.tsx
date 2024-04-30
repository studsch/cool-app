"use client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export function LikeButton({ likesCount }: { likesCount: string }) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <>
      <button
        className="hover:bg-slate-50 p-2 rounded-md"
        type="button"
        onClick={val => {
          setIsLiked(!isLiked);
        }}
      >
        <div className="flex gap-2 justify-center items-center">
          {isLiked ? (
            <FontAwesomeIcon
              icon={faHeart}
              size="lg"
              className="text-button-primary-color"
            ></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon
              icon={faHeartRegular}
              size="lg"
              className="text-text-primary-color"
            ></FontAwesomeIcon>
          )}
          <p className="text-sm font-medium text-text-primary-color">
            {likesCount} Likes
          </p>
        </div>
      </button>
    </>
  );
}
