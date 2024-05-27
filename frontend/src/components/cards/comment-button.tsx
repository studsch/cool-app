import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useCountOfComments } from "@/store";

export function CommentButton() {
  const count = useCountOfComments(state => state.count);
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
            {count} Comments
          </p>
        </div>
      </button>
    </>
  );
}
