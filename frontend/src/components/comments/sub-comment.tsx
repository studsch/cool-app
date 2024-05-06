import React from "react";
import { useSubComments } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toNormalDateTime } from "@/lib/utils";
import AddArea from "./add-area";

export default function SubComment({
  comment,
  classNames,
  setReplyingId,
  replyingId,
  post,
  setSubComments,
  subComments,
}: {
  comment: any;
  classNames?: { img?: string };
  setReplyingId: Function;
  replyingId: string;
  post: any;
  setSubComments: Function;
  subComments: any[];
}) {
  return (
    typeof comment != "undefined" && (
      <div className="flex gap-3 my-2 w-full">
        <Avatar className={classNames?.img}>
          <AvatarImage
            src={
              process.env.MINIO_PUBLIC_DOMEN_URL
                ? process.env.MINIO_PUBLIC_DOMEN_URL + comment.avatarURL
                : ""
            }
          />
          <AvatarFallback>{comment.author.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full">
          <p className="h-5 text-sm">{comment.author}</p>
          <p className="text-sm">{comment.content}</p>
          <div className="flex gap-2">
            <p className="text-text-secondary-color text-sm ">
              {toNormalDateTime(comment.createdAt)}
            </p>
            <p
              className="link text-sm"
              onClick={val => {
                setReplyingId(comment.id);
              }}
            >
              Reply
            </p>
          </div>
          {/* <SubComment comment={comment}></SubComment> */}
          {replyingId == comment.id && (
            <AddArea
              setReplyId={setReplyingId}
              classNames={{ img: "h-8 w-8", textarea: "min-h-[36px] h-[36px]" }}
              defualtContent={comment.author + ", "}
              idxToDel={undefined}
              setIdxToDel={() => {}}
              comments={subComments}
              setComments={setSubComments}
              post={post}
              reply={comment.id}
              src={
                process.env.MINIO_PUBLIC_DOMEN_URL
                  ? process.env.MINIO_PUBLIC_DOMEN_URL + post.userAvatar
                  : ""
              }
              userTitle={post.userFirstName + " " + post.userLastName}
            />
          )}
        </div>
      </div>
    )
  );
}
