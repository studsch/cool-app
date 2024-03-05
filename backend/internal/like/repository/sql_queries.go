package repository

const (
	likePostQuery = `
INSERT INTO like_post(
	id, user_id, post_id
) VALUES (
	default, $1, $2
) RETURNING (
	id, user_id, post_id
)
`
	unlikePostQuery = `
DELETE FROM like_post
WHERE user_id=$1 AND post_id=$2
`
	getPostLikeCountQuery = `
SELECT COUNT(ID)
FROM like_post
WHERE post_id=$1
`
	likeCommentQuery = `
INSERT INTO like_comment(
	id, user_id, comment_id
) VALUES (
	default, $1, $2
) RETURNING (
	id, user_id, comment_id
)
`
	unlikeCommentQuery = `
DELETE FROM like_comment
WHERE user_id=$1 AND comment_id=$2
`
)
