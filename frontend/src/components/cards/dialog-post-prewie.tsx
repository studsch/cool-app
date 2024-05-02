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
import Image from "next/image";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 300;
const INCREASE_KOEF = 1.2;

export function DialogPostPrewie({
  posts,
  loadMore,
}: {
  posts: any;
  loadMore: Function;
}) {
  const [isOpenedIndex, setIsOpenedIndex] = useState<number | undefined>(
    undefined,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [screenWidth, screenHeight] = useResize();
  const [maxHeight, setMaxHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lastScreenWidth, setLastScreenWidth] = useState(0);
  const [lastScreenHeight, setLastScreenHeight] = useState(0);
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
        <DialogOverlay className="bg-[rgba(36,15,33,0.7)] backdrop-blur-[1px] z-50 overflow-auto">
          <div className="flex min-h-screen h-fit">
            <Arrow
              side="left"
              size="4x"
              onClick={() => {
                typeof isOpenedIndex != "undefined" &&
                  isOpenedIndex > 0 &&
                  setIsOpenedIndex(isOpenedIndex - 1);
              }}
              classNames={{
                base: " cursor-pointer w-[14vw] transition hover:text-[rgba(36,15,33,0.5)] text-[rgba(36,15,33,0.2)] flex justify-center items-center bg-transparent hover:bg-[rgba(36,15,33,0.03)]",
              }}
            ></Arrow>
            <div className="min-h-screen h-fit relative w-full flex justify-center items-center">
              {" "}
              <div
                className="w-full h-full absolute"
                onClick={() => {
                  setIsOpen(false);
                }}
              ></div>
              {/* карточка поста */}
              <DialogPrimitive.Content
                onEscapeKeyDown={() => {
                  setIsOpen(false);
                }}
                // ref={ref}
                className={cn(
                  "border-none min-w-[420px] px-8 z-50 relative gap-4 h-fit w-fit bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg rounded-md",
                  // className,
                )}
                // {...props}
              >
                {typeof isOpenedIndex != "undefined" && (
                  <>
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
                                      const maxScreenRatioWidth =
                                        (screenWidth * 2) /
                                        3 /
                                        img.naturalWidth;
                                      const maxScreenRatioHeight =
                                        (screenHeight * 2) /
                                        3 /
                                        img.naturalHeight;
                                      const maxScaleRatio = INCREASE_KOEF; // Максимальное увеличение до 1.2 от исходного размера

                                      // Выбираем наименьшее значение из максимальных отношений ширины и высоты экрана и 1.2-кратного масштаба
                                      let scale = Math.min(
                                        maxScreenRatioWidth,
                                        maxScreenRatioHeight,
                                        maxScaleRatio,
                                      );

                                      // Вычисляем новые размеры изображения с учетом масштаба
                                      let newWidth = Math.floor(
                                        img.naturalWidth * scale,
                                      );
                                      let newHeight = Math.floor(
                                        img.naturalHeight * scale,
                                      );

                                      // Обновляем ширину и высоту в состоянии компонента
                                      setWidth(newWidth);
                                      setHeight(newHeight);

                                      // Проверяем, нужно ли обновить максимальные значения ширины и высоты
                                      if (
                                        screenHeight != lastScreenHeight ||
                                        screenWidth != lastScreenWidth
                                      ) {
                                        setMaxHeight(newHeight);
                                        setMaxWidth(newWidth);
                                      } else {
                                        if (newWidth > maxWidth) {
                                          setMaxWidth(newWidth); // Записываем текущую ширину как максимально возможную
                                        }
                                        if (newHeight > maxHeight) {
                                          setMaxHeight(newHeight); // Записываем текущую высоту как максимально возможную
                                        }
                                      }
                                      setLastScreenHeight(screenHeight);
                                      setLastScreenWidth(screenWidth);
                                    },
                                  );
                                }
                                return (
                                  <SwiperSlide
                                    className="bg-[#2c1d47f5]"
                                    style={{
                                      width: `${maxWidth}px`,
                                      height: `${maxHeight}px`,
                                      borderRadius: "14px",
                                    }}
                                    key={index}
                                  >
                                    <Image
                                      src={
                                        process.env.MINIO_PUBLIC_DOMEN_URL
                                          ? process.env.MINIO_PUBLIC_DOMEN_URL +
                                            val
                                          : ""
                                      }
                                      alt="kitten"
                                      height={height}
                                      width={width}
                                      className="rounded-md object-contain absolute"
                                    ></Image>
                                  </SwiperSlide>
                                );
                              },
                            )
                          : null}
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
                  </>
                )}
              </DialogPrimitive.Content>
            </div>
            <Arrow
              onClick={async () => {
                if (typeof isOpenedIndex != "undefined") {
                  console.log(isOpenedIndex);
                  if (isOpenedIndex + 1 < posts.length) {
                    setIsOpenedIndex(isOpenedIndex + 1);
                  } else {
                    const error = await loadMore();
                    console.log(error);
                  }
                }
              }}
              side="right"
              size="4x"
              classNames={{
                base: "cursor-pointer w-[14vw] transition hover:text-[rgba(36,15,33,0.5)] text-[rgba(36,15,33,0.2)] flex justify-center items-center bg-transparent hover:bg-[rgba(36,15,33,0.03)]",
              }}
            ></Arrow>
          </div>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
