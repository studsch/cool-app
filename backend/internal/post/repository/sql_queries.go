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
	updatePostQuery = `
UPDATE post
SET description=$1, location=$2, image_urls=$3
WHERE id=$4 AND deleted=FALSE AND archived=FALSE
RETURNING (
	id, user_id, description, location, created_at,
    image_urls, archived, deleted
)
`
	archivePostQuery = `
UPDATE post
SET archived=TRUE
WHERE id=$1 AND deleted=FALSE AND archived=FALSE
`
	deletePostQuery = `
UPDATE post
SET deleted=TRUE
WHERE id=$1 AND deleted=FALSE
`
	getByIdQuery = `
SELECT (
    p.id, p.user_id, p.description, p.location,
	p.created_at, p.image_urls, CONCAT(u.first_name, ' ', u.last_name)
) FROM post p LEFT JOIN users u ON u.id = p.user_id
WHERE p.id=$1
`
	getTotalCountQuery = `
SELECT COUNT(id)
FROM post
WHERE deleted=FALSE AND archived=FALSE
`
	getPostsQuery = `
SELECT (
	id, user_id, description, location, created_at,
	image_urls
) FROM post
WHERE deleted=FALSE AND archived=FALSE
ORDER BY created_at OFFSET $1 LIMIT $2
`
)
