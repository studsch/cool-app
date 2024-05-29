import React from "react";
import Link from "next/link";
import AvatarBlock from "../avatarblock/avatarblock";
import { FetchFavoriteWidget } from "@/fetch/favorites";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

export default async function FavoriteWidget({
  className,
}: {
  className?: string;
}) {
  const session = await getServerSession(authConfig);
  let item = undefined;
  if (session?.user?.tokens?.access) {
    item = await FetchFavoriteWidget(session?.user?.tokens?.access);
    if (typeof item.error == "undefined")
      return (
        <div className={cn(className)}>
          <h2 className="text-text-primary-color font-semibold ">Most liked</h2>
          <Link href={item.mostLikedUserInfo.login} className="p-1">
            <AvatarBlock
              src={
                process.env.MINIO_PUBLIC_DOMEN_URL +
                item.mostLikedUserInfo.avatar
              }
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
          </Link>
          <h2 className="text-text-primary-color font-semibold">Most viewed</h2>
          <Link href={item.mostViewedUserInfo.login} className="p-1">
            <AvatarBlock
              src={
                process.env.MINIO_PUBLIC_DOMEN_URL +
                item.mostViewedUserInfo.avatar
              }
              fallback={
                item.mostViewedUserInfo.firstName[0] +
                item.mostViewedUserInfo.lastName[0]
              }
              title={
                item.mostViewedUserInfo.firstName +
                " " +
                item.mostViewedUserInfo.lastName
              }
              subtitle={"@" + item.mostViewedUserInfo.login}
              avatarPosition="other"
            />
          </Link>
          <h2 className="text-text-primary-color font-semibold">
            Favorite tag
          </h2>
          <p className="link p-1">{item.mostLikedTag.title}</p>
        </div>
      );
  }
  return null;
}
