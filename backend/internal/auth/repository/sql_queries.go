package repository

// TODO: add queries
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
    (id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at)
`
	findUserByLoginQuery = `
SELECT
	(id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at)
FROM users
WHERE login = $1
`
	findUserByPhoneQuery = `
SELECT
	(id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at)
FROM users
WHERE phone_number = $1
`
)
