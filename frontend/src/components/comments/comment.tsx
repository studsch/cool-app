"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toNormalDateTime } from "@/lib/utils";
import AddArea from "./add-area";
import { useSubComments } from "@/store";
import SubComment from "./sub-comment";
import { FetchReplyComments } from "@/fetch/comment";
import { getAllReplys } from "@/lib/utils";
export default function Comment({
  src,
  userTitle,
  comment,
  createdAt,
  classNames,
  replyingId,
  setReplyingId,
  post,
}: {
  src: string;
  userTitle: string;
  comment: any;
  createdAt: string;
  replyingId: string;
  setReplyingId: Function;
  classNames?: { img?: string };
  post?: any;
}) {
  const [subComments, setSubComments] = useState<any[]>([]);
  useEffect(() => {
    getAllReplys(`page=${1}&size=${100000}`, comment.id).then(val => {
      console.log(val);
      setSubComments(val);
    });
  }, [comment]);
  return (
    <>
      <div className="flex gap-3 my-2 w-full">
        <Avatar className={classNames?.img}>
          <AvatarImage src={src} />
          <AvatarFallback>{userTitle.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full">
          <p className="h-5 text-sm">{userTitle}</p>
          <p className="text-sm">{comment.content}</p>
          <div className="flex gap-2">
            <p className="text-text-secondary-color text-sm ">
              {toNormalDateTime(createdAt)}
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
          {subComments.length > 0
            ? subComments.map((val: any, index: number) => (
                <SubComment
                  classNames={{ img: "h-8 w-8 mt-[2px]" }}
                  key={index}
                  comment={val}
                  post={post}
                  subComments={subComments}
                  setSubComments={setSubComments}
                  setReplyingId={setReplyingId}
                  replyingId={replyingId}
                ></SubComment>
              ))
            : null}

          {replyingId == comment.id && (
            <AddArea
              classNames={{ img: "h-8 w-8", textarea: "min-h-[36px] h-[36px]" }}
              defualtContent={userTitle + ", "}
              idxToDel={undefined}
              setIdxToDel={() => {}}
              comments={subComments}
              setComments={setSubComments}
              post={post}
              reply={comment.id}
              setReplyId={setReplyingId}
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
    </>
  );
}
