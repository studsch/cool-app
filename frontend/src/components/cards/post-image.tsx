"use client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

export function PostImage() {
  return (
    <>
      <div className="min-h-0 max-h-[600px] w-full aspect-[3/4] h-fit relative">
        <Image
          src="http://localhost:3000/kitten.jpg"
          alt="kitten"
          fill
          className="rounded-md object-contain"
        ></Image>
      </div>
    </>
  );
}
