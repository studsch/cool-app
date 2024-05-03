"use client";

import React, { useEffect, useState } from "react";
import { FetchComments } from "@/fetch/comment";
import Comment from "./comment";
import AddArea from "./add-area";

export default function Comments({ post }: { post: any }) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const size = 3;
  const [comments, setComments] = useState([]);
  const [idxToDel, setIdxToDel] = useState(undefined);
  console.log(comments);
  useEffect(() => {
    FetchComments(`?page=${page}&size=${size}`, post.id)
      .then(val => {
        setComments(val.comments);
        setTotalPages(val.totalPages);
      })
      .catch(msg => console.log(msg));
  }, [post]);
  return (
    <div>
      {comments ? (
        <div>
          {comments.map((item: any, index: number) => {
            return (
              <Comment
                key={index}
                src={
                  process.env.MINIO_PUBLIC_DOMEN_URL
                    ? process.env.MINIO_PUBLIC_DOMEN_URL + item.avatarURL
                    : ""
                }
                userTitle={item.author}
                comment={item.content}
                createdAt={item.createdAt}
              ></Comment>
            );
          })}
          {totalPages && totalPages != page && (
            <p
              className="text-text-secondary-color link text-sm px-1"
              onClick={() => {
                FetchComments(`?page=${page + 1}&size=${size}`, post.id)
                  .then(val => {
                    let tmp_c = comments;
                    if (typeof idxToDel != "undefined") {
                      tmp_c = comments.slice(0, idxToDel);
                      setIdxToDel(undefined);
                    }
                    setComments(tmp_c.concat(val.comments));
                    setTotalPages(val.totalPages);
                    setPage(page + 1);
                  })
                  .catch(msg => console.log(msg));
              }}
            >
              Load more comments
            </p>
          )}
        </div>
      ) : null}
      <AddArea
        idxToDel={idxToDel}
        setIdxToDel={setIdxToDel}
        comments={comments}
        setComments={setComments}
        post={post}
        src={
          process.env.MINIO_PUBLIC_DOMEN_URL
            ? process.env.MINIO_PUBLIC_DOMEN_URL + post.userAvatar
            : ""
        }
        userTitle={post.userFirstName + " " + post.userLastName}
      ></AddArea>
    </div>
  );
}
