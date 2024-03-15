package repository

const (
	createCommentQuery = `
INSERT INTO comment(
	user_id, post_id, reply_to_comment_id, content,
	deleted, created_at
) VALUES (
	$1, $2,
    NULLIF($3, '00000000-0000-0000-0000-000000000000')::UUID,
    $4, FALSE, NOW()
) RETURNING
	id, user_id, post_id, reply_to_comment_id, content,
	created_at
`
	deleteCommentQuery = `
UPDATE comment
SET deleted=TRUE
WHERE id=$1 AND deleted=FALSE
`
	getByIdQuery = `
SELECT
	c.id, c.user_id, c.post_id, c.reply_to_comment_id, c.content,
	c.created_at, CONCAT(u.first_name, ' ', u.last_name), u.avatar
FROM comment c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.id=$1 AND c.deleted=FALSE
`
	getTotalCountByPostQuery = `
SELECT COUNT(id)
FROM comment
WHERE post_id=$1 AND deleted=FALSE
`
	getAllByPostIdQuery = `
SELECT
	c.id, c.user_id, c.post_id, c.reply_to_comment_id, c.content,
	c.created_at, CONCAT(u.first_name, ' ', u.last_name), u.avatar
FROM comment c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.post_id=$1 AND c.deleted=FALSE
ORDER BY c.created_at OFFSET $2 LIMIT $3
`
	getTotalCountReplyByCommentQuery = `
SELECT COUNT(id)
FROM comment
WHERE reply_to_comment_id=$1 AND deleted=FALSE
`
	getReplyByCommentIdQuery = `
SELECT
	c.id, c.user_id, c.post_id, c.reply_to_comment_id, c.content,
	c.created_at, CONCAT(u.first_name, ' ', u.last_name), u.avatar
FROM comment c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.reply_to_comment_id=$1 AND c.deleted=FALSE
ORDER BY c.created_at OFFSET $2 LIMIT $3
`
)
