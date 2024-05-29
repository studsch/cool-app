import React from "react";
import Link from "next/link";
import AvatarBlock from "../avatarblock/avatarblock";
import { FetchFavoriteWidget } from "@/fetch/favorites";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth";

export default async function FavoriteWidget() {
  const session = await getServerSession(authConfig);
  console.log(session);
  //   const item = await FetchFavoriteWidget();
  return (
    <div>
      <h2 className="text-text-primary-color font-medium">Most liked</h2>
      {/* <Link href={item.mostLikedUserInfo.login}>
        <AvatarBlock
          src={item.mostLikedUserInfo.avatar}
          fallback={
            item.mostLikedUserInfo.firstName[0] +
            item.mostLikedUserInfo.lastName[0]
          }
          title={
            item.mostLikedUserInfo.firstName +
            " " +
            item.mostLikedUserInfo.lastName
          }
          subtitle={"@" + item.mostLikedUserInfo.login}
          avatarPosition="other"
        />
      </Link> */}
      <h2 className="text-text-primary-color font-medium">Most viewed</h2>
      <h2 className="text-text-primary-color font-medium">Favorite tag</h2>
    </div>
  );
}
