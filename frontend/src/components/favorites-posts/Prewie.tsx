"use client";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Prewie({
  post,
  className,
}: {
  post: any;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "aspect-[3/4] relative overflow-hidden rounded-lg cursor-pointer",
        className,
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
        className="rounded-md object-scale-down"
      ></Image>
    </div>
  );
}
