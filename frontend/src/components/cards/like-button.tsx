"use client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "next-auth/react";
import { RenewToken, RenewWrapper } from "@/fetch/token";
import { Like, UnLike } from "@/fetch/post";
import { tokenUpdateStateGlobal } from "@/fetch/token";

export function LikeButton({
  likesCount,
  isLikedPost,
  postId,
}: {
  likesCount: string;
  isLikedPost: boolean;
  postId: string;
}) {
  const [isLiked, setIsLiked] = useState(isLikedPost);
  const { data: session, status, update } = useSession();
  const onClick = async () => {
    if (session?.user?.tokens?.access) {
      if (!isLiked) {
        const res = await RenewWrapper(
          Like,
          [session.user.tokens.access, postId],
          RenewToken,
          [session.user.id, session.user.tokens.refresh],
          update,
          tokenUpdateStateGlobal,
        );
        if (res == 201) {
          console.log(res);
          setIsLiked(true);
        }
      } else {
        const res = await RenewWrapper(
          UnLike,
          [session.user.tokens.access, postId],
          RenewToken,
          [session.user.id, session.user.tokens.refresh],
          update,
          tokenUpdateStateGlobal,
        );
        if (res == 200) {
          console.log(res);
          setIsLiked(false);
        }
      }
    }

    return true;
  };
  return (
    <>
      <button
        className="hover:bg-slate-50 p-2 rounded-md"
        type="button"
        onClick={val => {
          onClick();
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
