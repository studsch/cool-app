package repository

const (
	createPostQuery = `
INSERT INTO post(
    user_id, description, location, created_at, image_urls,
    archived, deleted
) VALUES (
	$1, $2, $3, NOW(), $4,
    $5, $6
) RETURNING (
	id, user_id, description, location, created_at,
    image_urls, archived, deleted
)
`
)
