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
)
