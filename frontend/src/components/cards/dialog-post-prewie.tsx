"use client";

import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AvatarBlock from "../avatarblock/avatarblock";
import { PostMore } from "./more";
import { PostImage } from "./post-image";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { LikeButton } from "./like-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { ShareButton } from "./share-button";
import { ScrollArea } from "../ui/scroll-area";
import { CommentButton } from "./comment-button";

export function DialogPostPrewie() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-[rgba(36,15,33,0.7)] backdrop-blur-[1px]" />

        <DialogPrimitive.Content
          // ref={ref}
          className={cn(
            "fixed  left-[50%] top-[50%] z-50 2xl:max-w-[800px] sm:w-[50vw] w-[80vw] xl:max-w-[640px] h-max-fit translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg rounded-md",
            // className,
          )}
          // {...props}
        >
          <ScrollArea className="h-fit w-full px-8">
            <div className="flex flex-col gap-4 py-6">
              <div className="flex justify-between">
                <AvatarBlock
                  title="Albert Enstein"
                  subtitle="22 September, 2024"
                  classNames={{ img: "h-12 w-12" }}
                  avatarPosition="other"
                />
                <PostMore></PostMore>
              </div>
              <PostImage></PostImage>

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
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </ScrollArea>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
