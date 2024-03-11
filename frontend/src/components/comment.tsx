import React, { useState } from "react";

interface Comment {
  name: string;
  photo: string;
  comment: string;
}

const Comment = ({
  name,
  photo,
  comment,
  allComments,
}: {
  name: string;
  photo: string;
  comment: string;
  allComments: Comment[];
}) => {
  const [showAllComments, setShowAllComments] = useState(false);

  const handleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <img src={photo} alt="commenter" className="avatar" />
        <p>{name}:</p>
      </div>
      <p className="comment-text">{comment}</p>
      {showAllComments && allComments && allComments.length > 1
        ? allComments.map((c: Comment, index: number) => (
            <div key={index}>
              <div className="comment-header">
                <img src={c.photo} alt="commenter" className="avatar" />
                <p>{c.name}:</p>
              </div>
              <p className="comment-text">{c.comment}</p>
            </div>
          ))
        : allComments &&
          allComments.length > 1 && (
            <button onClick={handleShowAllComments}>Show more comments</button>
          )}
      {!allComments || (allComments && allComments.length === 0) ? (
        <p>No such results</p>
      ) : null}
    </div>
  );
};

export default Comment;
