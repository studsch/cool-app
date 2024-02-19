CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    id           UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
    first_name   VARCHAR(32)              NOT NULL CHECK ( first_name <> '' ),
    last_name    VARCHAR(32)              NOT NULL CHECK ( last_name <> '' ),
    login        VARCHAR(32) UNIQUE       NOT NULL CHECK ( login <> '' ),
    password     VARCHAR(250)             NOT NULL CHECK ( OCTET_LENGTH(password) <> 0 ),
    phone_number VARCHAR(16) UNIQUE       NOT NULL CHECK ( phone_number <> '' ),
    role         VARCHAR(10)              NOT NULL DEFAULT 'user' CHECK ( role = 'user' OR role = 'admin' ),
    avatar       VARCHAR(512),
    gender       VARCHAR(8)               NOT NULL CHECK ( gender = 'male' OR gender = 'female' ),
    about        VARCHAR(1024)                     DEFAULT '',
    city         VARCHAR(24),
    country      VARCHAR(24),
    birthday     DATE                     NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO users(
    first_name, last_name, login, password, phone_number,
    role, avatar, gender, about, city,
    country, birthday, created_at, updated_at
) VALUES (
    'first', 'last', 'login', 'pass', '+7123456789',
    'user', '', 'male', '', '',
    '2024-02-19', NOW(), NOW()
) RETURNING (
    id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at
);
