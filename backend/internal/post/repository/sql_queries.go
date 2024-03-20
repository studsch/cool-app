package repository

const (
	createPostQuery = `
INSERT INTO post(
    user_id, description, location, created_at, image_urls,
    archived, deleted
) VALUES (
	$1, $2, $3, NOW(), $4,
    $5, $6) RETURNING
	id, user_id, description, location, created_at,
    image_urls
`
	updatePostQuery = `
UPDATE post
	SET description = COALESCE(NULLIF($1, ''), description),
	location = COALESCE(NULLIF($2, ''), location),
	image_urls = $3
WHERE id = $4 AND deleted=FALSE AND archived=FALSE
RETURNING
	id, user_id, description, location, created_at,
	image_urls
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
SELECT
    p.id, p.user_id, p.description, p.location,
	p.created_at, p.image_urls, CONCAT(u.first_name, ' ', u.last_name)
FROM post p LEFT JOIN users u ON u.id = p.user_id
WHERE p.id=$1 AND p.deleted=FALSE AND p.archived=FALSE
`
	getTotalCountQuery = `
SELECT COUNT(id)
FROM post
WHERE deleted=FALSE AND archived=FALSE
`
	getPostsQuery = `
SELECT
	id, user_id, description, location, created_at,
	image_urls
FROM post
WHERE deleted=FALSE AND archived=FALSE
ORDER BY created_at OFFSET $1 LIMIT $2
`
	getByUserIdQuery = `
SELECT
	id, user_id, description, location, created_at,
	image_urls
FROM post
WHERE user_id=$1 AND deleted=FALSE AND archived=FALSE
ORDER BY created_at OFFSET $2 LIMIT $3
`

	searchGetTotalCountQuery = `
SELECT COUNT(*)
FROM (
    SELECT id, importance
    FROM (
        SELECT post.id, COUNT(*) AS importance
        FROM post
        JOIN post_tags ON post.id = post_tags.post_id AND post.deleted = FALSE AND post.archived = FALSE
        JOIN tags ON post_tags.tag_id = tags.id
        WHERE tags.title = any ($1)
        GROUP BY post.id

        UNION ALL

        SELECT id, similarity(description, $2) AS importance
        FROM post
        WHERE deleted = FALSE AND archived = FALSE
    ) AS combined_result
) AS res_ids
WHERE importance > 0.3
`

	searchPostQuery = `
WITH similarity_cte AS (
	SELECT id, SUM(importance) AS importance
    FROM (
		SELECT id, importance
        FROM (
			SELECT post.id, COUNT(*) AS importance
            FROM post
            JOIN post_tags ON post.id = post_tags.post_id AND post.deleted = FALSE AND post.archived = FALSE
            JOIN tags ON post_tags.tag_id = tags.id
			WHERE tags.title = any ($1)
			GROUP BY post.id

            UNION ALL

			SELECT id, similarity(description, $2) AS importance
            FROM post
            WHERE deleted = FALSE AND archived = FALSE
		) AS combined_result
	) AS res_ids
    WHERE importance > 0.3
    GROUP BY id
) SELECT post.id, user_id, description, location, created_at, image_urls
FROM post
JOIN similarity_cte ON post.id = similarity_cte.id
WHERE importance > 0.3 AND deleted = FALSE AND archived = FALSE
ORDER BY importance DESC OFFSET $3 LIMIT $4;
`

	searchByFilterGetTotalCountQuery = `
SELECT COUNT(*)
FROM (
    SELECT id, importance, location, created_at, deleted, archived
    FROM (
        SELECT post.id, COUNT(*) AS importance, location, created_at, deleted, archived
        FROM post
        JOIN post_tags ON post.id = post_tags.post_id AND post.deleted = FALSE AND post.archived = FALSE
        JOIN tags ON post_tags.tag_id = tags.id
        WHERE tags.title = any ($1)
        GROUP BY post.id

        UNION ALL

        SELECT id, similarity(description, $2) AS importance, location, created_at, deleted, archived
        FROM post
        WHERE deleted = FALSE AND archived = FALSE
    ) AS combined_result
) AS res_ids
`

	searchByFilterPostQuery = `
WITH similarity_cte AS (
	SELECT id, SUM(importance) AS importance
    FROM (
		SELECT id, importance
        FROM (
			SELECT post.id, COUNT(*) AS importance
            FROM post
            JOIN post_tags ON post.id = post_tags.post_id AND post.deleted = FALSE AND post.archived = FALSE
            JOIN tags ON post_tags.tag_id = tags.id
			WHERE tags.title = any ($1)
			GROUP BY post.id

            UNION ALL

			SELECT id, similarity(description, $2) AS importance
            FROM post
            WHERE deleted = FALSE AND archived = FALSE
		) AS combined_result
	) AS res_ids
    WHERE importance > 0.3
    GROUP BY id
) SELECT post.id, user_id, description, location, created_at, image_urls, deleted, archived
FROM post
JOIN similarity_cte ON post.id = similarity_cte.id
`
)
