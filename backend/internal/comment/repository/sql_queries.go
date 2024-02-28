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
) RETURNING (
	id, user_id, post_id, reply_to_comment_id, content,
	created_at
)
`
)
