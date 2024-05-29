"use client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "next-auth/react";
import { Like, UnLike } from "@/fetch/post";
import { useFavorites } from "@/store";
import { GetLikesFromPost } from "@/fetch/post";
import { FetchWithTokenRefresh } from "@/fetch/token";

export function LikeButton({
  isLikedPost,
  postId,
  currentIndex,
}: {
  isLikedPost: boolean;
  postId: string;
  currentIndex: number;
}) {
  const [likesCount, setLikesCount] = useState<number | undefined>(undefined);
  const updateIsLiked = useFavorites(state => state.updateIsLiked);
  useEffect(() => {
    GetLikesFromPost(postId).then(val => {
      setLikesCount(val.likeCount);
    });
  });
  const { data: session, status, update } = useSession();
  const onClick = async () => {
    if (session?.user?.tokens?.access) {
      if (!isLikedPost) {
        const res = await FetchWithTokenRefresh(
          Like,
          session.user.tokens.access,
          postId,
          update,
        );
        if (res == 201) {
          if (typeof likesCount != "undefined") {
            setLikesCount(likesCount + 1);
            updateIsLiked(currentIndex, true);
          }
        }
      } else {
        const res = await FetchWithTokenRefresh(
          UnLike,
          session.user.tokens.access,
          postId,
          session.user.id,
          session.user.tokens.refresh,
          update,
        );
        if (res == 200) {
          if (likesCount) {
            setLikesCount(likesCount - 1);
            updateIsLiked(currentIndex, false);
          }
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
          {isLikedPost ? (
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
