"use client";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Prewie({
  post,
  className,
  onClick,
}: {
  post: any;
  className?: string;
  onClick?: Function;
}) {
  return (
    <div
      className="p-1 w-full"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <div
        className={cn(
          "aspect-[3/4] w-full relative overflow-hidden rounded-lg cursor-pointer ",
        )}
      >
        <Image
          src={
            process.env.MINIO_PUBLIC_DOMEN_URL
              ? process.env.MINIO_PUBLIC_DOMEN_URL + post.imageURLs[0]
              : ""
          }
          alt={post.description.slice(0, 10)}
          fill
          sizes="auto"
          className="rounded-md object-cover absolute blur-lg"
        ></Image>
        <Image
          src={
            process.env.MINIO_PUBLIC_DOMEN_URL
              ? process.env.MINIO_PUBLIC_DOMEN_URL + post.imageURLs[0]
              : ""
          }
          alt={post.description.slice(0, 10)}
          fill
          sizes="auto"
          className="rounded-md object-scale-down"
        ></Image>
      </div>
    </div>
  );
}
