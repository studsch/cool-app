package repository

const (
	createUserQuery = `
INSERT INTO users(
    first_name, last_name, login, password, phone_number,
    role, avatar, gender, about, city,
    country, birthday, created_at, updated_at
) VALUES (
    $1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10,
    $11, $12, NOW(), NOW()
) RETURNING
    id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at
`
	findUserByLoginQuery = `
SELECT
	id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at
FROM users
WHERE login = $1
`
	findUserByPhoneQuery = `
SELECT
	id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at
FROM users
WHERE phone_number = $1
`
	getUserByIDQuery = `
SELECT
	id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at
FROM users
WHERE id = $1
`
	updateUserQuery = `
UPDATE users
	SET first_name = COALESCE(NULLIF($1, ''), first_name),
	last_name = COALESCE(NULLIF($2, ''), last_name),
	login = COALESCE(NULLIF($3, ''), login),
	password = COALESCE(NULLIF($4, ''), password),
	phone_number = COALESCE(NULLIF($5, ''), phone_number),
    role = COALESCE(NULLIF($6, ''), role),
	avatar = COALESCE(NULLIF($7, ''), avatar),
	gender = COALESCE(NULLIF($8, ''), gender),
	about = COALESCE(NULLIF($9, ''), about),
	city = COALESCE(NULLIF($10, ''), city),
    country = COALESCE(NULLIF($11, ''), country),
	updated_at = NOW()
WHERE id = $12
RETURNING
	id, first_name, last_name, login, password,
	phone_number, role, avatar, gender, about,
	city, country, birthday, created_at, updated_at
`

	searchGetTotalCountQuery = `
SELECT COUNT(*)
FROM (
	SELECT id, similarity(first_name || ' ' || last_name, $1) AS importance
	FROM users
) AS res_ids
WHERE importance > 0.3;
`

	searchUserQuery = `
WITH similarity_cte AS (
	SELECT id, similarity(first_name || ' ' || last_name, $1) AS importance
    FROM users
) SELECT
	users.id, first_name, last_name, avatar,
	gender, about, city, country, birthday,
	created_at, updated_at
FROM users
JOIN similarity_cte ON users.id = similarity_cte.id
WHERE importance > 0.3
ORDER BY importance DESC OFFSET $2 LIMIT $3;
`

	searchUserByFilterQuery = `
WITH similarity_cte AS (
	SELECT id, similarity(first_name || ' ' || last_name, $1) AS importance
	FROM users
) SELECT
	users.id, first_name, last_name, avatar,
	gender, about, city, country, birthday,
	created_at, updated_at
FROM users
JOIN similarity_cte ON users.id = similarity_cte.id
`

	searchByFilterGetTotalCountQuery = `
SELECT COUNT(*)
FROM (
	SELECT id, similarity(first_name || ' ' || last_name, $1) AS importance, *
	FROM users
) AS res_ids
`
)
