package repository

const (
	followToUser = `
INSERT INTO follow(
	id, user_id, follow_to_user_id, notification_on
) VALUES (
	DEFAULT, $1, $2, $3
) RETURNING
	id, user_id, follow_to_user_id, notification_on
`

	unfollowUser = `
DELETE FROM follow
WHERE user_id=$1 AND follow_to_user_id=$2
`

	updateNotification = `
UPDATE follow
SET notification_on=$1
WHERE user_id=$2 AND follow_to_user_id=$3
RETURNING
	id, user_id, follow_to_user_id, notification_on
`

	getCountOfSubscriptions = `
SELECT COUNT(*)
FROM follow
WHERE user_id=$1
`

	getCountOfSubscribers = `
SELECT COUNT(*)
FROM follow
WHERE follow_to_user_id=$1
`

	getSubscriptionsUserIDs = `
SELECT follow_to_user_id
FROM follow
WHERE user_id=$1
`

	getUsersInfoByIDs = `
SELECT first_name
FROM users
WHERE id = ANY ($1)
`

	getSubscriptionsByUserID = `
SELECT
	u.id, u.first_name, u.last_name, u.login,
	u.avatar, u.gender, u.about, u.city,
	u.country, u.birthday, u.login
FROM users AS u
LEFT JOIN follow AS f
ON f.follow_to_user_id = u.id
WHERE f.user_id = $1
`

	searchByFilterGetTotalCountQuery = `
SELECT COUNT(*)
FROM (
	SELECT id, similarity(first_name || ' ' || last_name, $1) AS importance, *
	FROM users
) AS res_ids
`

	searchUserByFilterQuery = `
WITH similarity_cte AS (
	SELECT id, similarity(first_name || ' ' || last_name, $1) AS importance
	FROM users
) SELECT
	users.id, first_name, last_name, avatar,
	gender, about, city, country, birthday,
	created_at, updated_at, login
FROM users
JOIN similarity_cte ON users.id = similarity_cte.id
`
)
