import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { getMeta } from "@/lib/utils";
import { useState } from "react";

export function PostImage() {
  const imgTest = "http://localhost:3000/kitten.jpg";
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const winH = window.innerHeight;
  const winW = window.innerWidth;
  getMeta(imgTest, (err: any, img: any) => {
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
  });
  return (
    <>
      <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
        <Image
          src="http://localhost:3000/kitten.jpg"
          alt="kitten"
          fill
          className="rounded-md object-cover absolute blur-lg"
        ></Image>
        <Image
          src="http://localhost:3000/kitten.jpg"
          alt="kitten"
          fill
          className="rounded-md object-scale-down"
        ></Image>
      </div>
    </>
  );
}
