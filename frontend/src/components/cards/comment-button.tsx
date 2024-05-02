import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";

export function CommentButton({ commentCount }: { commentCount: string }) {
  return (
    <>
      <button className="hover:bg-slate-50 p-2 rounded-md" type="button">
        <div className="flex gap-2 justify-center items-center">
          <FontAwesomeIcon
            icon={faComment}
            size="lg"
            className="text-text-primary-color"
          ></FontAwesomeIcon>
          <p className="text-sm font-medium text-text-primary-color">
            {commentCount} Comments
          </p>
        </div>
      </button>
    </>
  );
}
