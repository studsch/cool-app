"use client";

import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import AvatarBlock from "../avatarblock/avatarblock";
import { PostMore } from "./more";
import { PostImage } from "./post-image";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { LikeButton } from "./like-button";
import { Pagination, Navigation } from "swiper/modules";
import { ShareButton } from "./share-button";
import { ScrollArea } from "../ui/scroll-area";
import { CommentButton } from "./comment-button";
import Prewie from "../favorites-posts/Prewie";
import { useEffect, useState } from "react";
import Arrow from "./arrow";
import { toNormalDateTime } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { getMeta } from "@/lib/utils";
import { useResize } from "@/hooks/screens";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 300;

export function DialogPostPrewie({ posts }: { posts: any }) {
  const [isOpenedIndex, setIsOpenedIndex] = useState<number | undefined>(
    undefined,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [screenWidth, screenHeight] = useResize();
  const [maxHeight, setMaxHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setMaxHeight(height);
    setMaxWidth(width);
    console.log(screenWidth, screenHeight);
  }, [screenWidth, screenHeight]);
  return (
    <Dialog open={isOpen}>
      {/* Закидываю все как один тригер, а контент буду менять через state, чтобы не создавать миллион объектов */}
      <DialogTrigger
        asChild
        className="w-full grid sm:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-2"
        onClick={() => setIsOpen(true)}
      >
        <div>
          {posts && posts.length != 0
            ? posts.map((post: any, index: number) =>
                post.imageURLs ? (
                  // превью для
                  <Prewie
                    key={index}
                    post={post}
                    className="p-1"
                    onClick={() => {
                      setIsOpenedIndex(index);
                      console.log(index);
                    }}
                  ></Prewie>
                ) : (
                  <div
                    className="p-1"
                    key={index}
                    onClick={() => {
                      setIsOpenedIndex(index);
                      console.log(index);
                    }}
                  >
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg cursor-pointer">
                      <div className="absolute z-0 w-full h-full bg-background-color-reg-light-gray"></div>
                      <p className="text-text-primary-color font-medium flex relative z-10 justify-center items-center h-full">
                        {post.description}
                      </p>
                    </div>
                  </div>
                ),
              )
            : null}
        </div>
      </DialogTrigger>
      {/* Добавляю стрелки для перелистывания постов */}
      <DialogPortal>
        <DialogOverlay className="bg-[rgba(36,15,33,0.7)] backdrop-blur-[1px] z-50">
          <div className="flex">
            <Arrow
              side="left"
              size="4x"
              classNames={{
                base: "relative cursor-pointer top-0 left-0 h-[100vh] w-[14vw] transition hover:text-[rgba(36,15,33,0.5)] text-[rgba(36,15,33,0.2)] flex justify-center items-center bg-transparent hover:bg-[rgba(36,15,33,0.03)]",
              }}
            ></Arrow>
            <div
              className="w-full h-[100vh]"
              onClick={() => {
                setIsOpen(false);
              }}
            ></div>
            <Arrow
              side="right"
              size="4x"
              classNames={{
                base: "cursor-pointer relative top-0 right-0 h-[100vh] w-[14vw] transition hover:text-[rgba(36,15,33,0.5)] text-[rgba(36,15,33,0.2)] flex justify-center items-center bg-transparent hover:bg-[rgba(36,15,33,0.03)]",
              }}
            ></Arrow>
          </div>
        </DialogOverlay>
        {/* карточка поста */}
        <DialogPrimitive.Content
          onEscapeKeyDown={() => {
            setIsOpen(false);
          }}
          // ref={ref}
          // "fixed overflow-hidden border-none px-8 left-[50%] top-[50%] max-h-[95vh] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg rounded-md",
          className={cn(
            "bg-[rgba(36,15,33,0.7)] backdrop-blur-[1px] z-50 flex absolute w-full h-full top-0 left-0",
            // className,
          )}
          // {...props}
        >
          <Arrow
            side="left"
            size="4x"
            classNames={{
              base: "relative cursor-pointer top-0 left-0 h-[100vh] w-[14vw] transition hover:text-[rgba(36,15,33,0.5)] text-[rgba(36,15,33,0.2)] flex justify-center items-center bg-transparent hover:bg-[rgba(36,15,33,0.03)]",
            }}
          ></Arrow>
          {typeof isOpenedIndex != "undefined" && (
            <div
              className="w-full h-[100vh]"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div
                data-state={isOpen ? "open" : "closed"}
                className="fixed overflow-hidden border-none px-8 left-[50%] top-[50%] max-h-[95vh] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg rounded-md"
              >
                <div className="flex flex-col gap-4 py-6">
                  <div className="flex justify-between">
                    <AvatarBlock
                      src={
                        process.env.MINIO_PUBLIC_DOMEN_URL
                          ? process.env.MINIO_PUBLIC_DOMEN_URL +
                            posts[isOpenedIndex].userAvatar
                          : ""
                      }
                      title={
                        posts[isOpenedIndex].userFirstName +
                        " " +
                        posts[isOpenedIndex].userLastName
                      }
                      subtitle={toNormalDateTime(
                        posts[isOpenedIndex].createdAt,
                      )}
                      classNames={{ img: "h-12 w-12" }}
                      avatarPosition="other"
                    />
                    <PostMore></PostMore>
                  </div>
                  {/* <PostImage></PostImage> */}
                  <Swiper
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="w-fit h-fit"
                  >
                    {posts[isOpenedIndex].imageURLs
                      ? posts[isOpenedIndex].imageURLs.map(
                          (val: any, index: any) => {
                            if (process.env.MINIO_PUBLIC_DOMEN_URL) {
                              getMeta(
                                process.env.MINIO_PUBLIC_DOMEN_URL + val,
                                (err: any, img: any) => {
                                  const targetWidth = (screenWidth * 2) / 3;
                                  const targetHeight = (screenHeight * 2) / 3;
                                  let widthRatio =
                                    targetWidth / img.naturalWidth;
                                  let heightRatio =
                                    targetHeight / img.naturalHeight;
                                  let scale = Math.min(widthRatio, heightRatio);

                                  // Вычисляем новые размеры изображения с учетом масштаба
                                  let newWidth = Math.floor(
                                    img.naturalWidth * scale,
                                  );
                                  let newHeight = Math.floor(
                                    img.naturalHeight * scale,
                                  );

                                  // Проверяем, не меньше ли новые размеры минимально допустимых
                                  if (
                                    newWidth < MIN_WIDTH ||
                                    newHeight < MIN_HEIGHT
                                  ) {
                                    // Пересчитываем масштаб, чтобы изображение не было меньше минимальных размеров
                                    if (newWidth < MIN_WIDTH) {
                                      scale = MIN_WIDTH / img.naturalWidth;
                                    }
                                    if (newHeight < MIN_HEIGHT) {
                                      scale = Math.max(
                                        scale,
                                        MIN_HEIGHT / img.naturalHeight,
                                      );
                                    }

                                    // Обновляем размеры изображения
                                    newWidth = Math.floor(
                                      img.naturalWidth * scale,
                                    );
                                    newHeight = Math.floor(
                                      img.naturalHeight * scale,
                                    );
                                  }

                                  // Устанавливаем новые размеры
                                  setWidth(newWidth);
                                  setHeight(newHeight);
                                  if (width > maxWidth) {
                                    setMaxWidth(width);
                                  }
                                  if (height > maxHeight) {
                                    setMaxHeight(height);
                                  }
                                  console.log(maxWidth, maxHeight);
                                },
                              );
                            }
                            return (
                              <SwiperSlide
                                className=""
                                style={{
                                  width: `${maxWidth}px`,
                                  height: `${maxHeight}px`,
                                  borderRadius: "14px",
                                  backgroundColor: "blue",
                                }}
                                key={index}
                              ></SwiperSlide>
                            );
                          },
                        )
                      : null}
                    {/* <SwiperSlide>
                    <img
                      src="https://swiperjs.com/demos/images/nature-1.jpg"
                      loading="lazy"
                    />
                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="https://swiperjs.com/demos/images/nature-2.jpg"
                      loading="lazy"
                    />
                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                  </SwiperSlide> */}
                  </Swiper>

                  <div className=" flex justify-between sm:flex-row flex-col">
                    <div className="flex gap-1 md:ml-[1%]">
                      <LikeButton likesCount="0" />
                      <ShareButton shareCount="0" />
                      <CommentButton commentCount="0" />
                    </div>
                  </div>
                  <div>
                    <hr className="border-t-1 border-r-4  w-full" />
                  </div>
                </div>
                <DialogPrimitive.Close
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <Cross2Icon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </div>
            </div>
          )}
          <Arrow
            side="right"
            size="4x"
            classNames={{
              base: "cursor-pointer relative top-0 right-0 h-[100vh] w-[14vw] transition hover:text-[rgba(36,15,33,0.5)] text-[rgba(36,15,33,0.2)] flex justify-center items-center bg-transparent hover:bg-[rgba(36,15,33,0.03)]",
            }}
          ></Arrow>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
