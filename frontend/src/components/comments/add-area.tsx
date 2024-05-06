import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { PostComment } from "@/fetch/comment";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
export default function AddArea({
  classNames,
  src,
  userTitle,
  post,
  reply,
  comments,
  setComments,
  idxToDel,
  setIdxToDel,
  defualtContent,
  setReplyId,
}: {
  classNames?: { img?: string; textarea?: string };
  src: string;
  userTitle: string;
  post: any;
  comments: any[];
  setComments: Function;
  reply?: string;
  idxToDel?: number;
  setIdxToDel: Function;
  defualtContent: string;
  setReplyId?: Function;
}) {
  const { data: session, status, update } = useSession();
  const maxSymbols = 256;
  const { toast } = useToast();
  const [commentText, setCommentText] = useState(defualtContent);
  const [countOfSymbols, setCountOfSymbols] = useState(0);
  const [isDisable, setIsDisable] = useState(true);
  return (
    <div className="my-2">
      <div
        className={cn(
          "flex gap-3 items-center",
          countOfSymbols > 0.8 * maxSymbols && "mb-5",
        )}
      >
        {" "}
        <Avatar className={classNames?.img}>
          <AvatarImage src={src} />
          <AvatarFallback>{userTitle.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Textarea
            value={commentText}
            onChange={val => {
              setCommentText(val.target.value);
              if (
                val.target.value.length > 0 &&
                val.target.value.length <= maxSymbols
              ) {
                setIsDisable(false);
              } else {
                setIsDisable(true);
              }
              setCountOfSymbols(val.target.value.length);
            }}
            placeholder="Write your comment"
            className={cn(
              "resize-none input input-primary h-max-fit h-[44px] overflow-hidden pr-[100px]",
              classNames?.textarea,
            )}
          />
          {countOfSymbols > 0.8 * maxSymbols && (
            <p className="text-text-secondary-color text-sm absolute pt-1">
              {countOfSymbols}/{maxSymbols}
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={isDisable}
          onClick={async () => {
            if (session?.user.tokens.access) {
              const val = await PostComment(
                session.user.tokens.access,
                post.id,
                commentText,
                reply,
              );
              val["author"] = session.user.name + " " + session.user.surname;
              val["avatarURL"] = session.user.avatar;
              if (val.status) {
                toast({
                  title: "Comment write error",
                  description: val.error,
                  duration: 2000,
                });
              } else {
                setIdxToDel(comments.length);
                setComments([...comments, val]);
                setCommentText("");
                if (typeof setReplyId != "undefined") setReplyId(undefined);
              }
            }
          }}
        >
          <FontAwesomeIcon
            className={cn(
              "text-text-secondary-color pl-2  transition",
              !isDisable && "hover:text-button-primary-color",
            )}
            icon={faArrowTurnUp}
            size="xl"
          />
        </button>
      </div>
    </div>
  );
}
