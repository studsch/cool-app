CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE
EXTENSION IF NOT EXISTS "pg_trgm";

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
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE post
(
    id          UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
    user_id     UUID                     NOT NULL REFERENCES users (id),
    description VARCHAR(256),
    location    VARCHAR(128),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    image_urls  VARCHAR(1024)[],
    archived    BOOLEAN                           DEFAULT FALSE,
    deleted     BOOLEAN                           DEFAULT FALSE
);

CREATE TABLE comment
(
    id                  UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id             UUID                                   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    post_id             UUID                                   NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    reply_to_comment_id UUID REFERENCES comment (id) ON DELETE CASCADE,
    content             VARCHAR(256)                           NOT NULL CHECK ( content <> '' ),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    deleted             BOOLEAN                  DEFAULT FALSE
);

CREATE TABLE like_post
(
    id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE
);

CREATE TABLE like_comment
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comment (id) ON DELETE CASCADE
);

CREATE TABLE tags
(
    id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(16) NOT NULL
);

CREATE UNIQUE INDEX CONCURRENTLY tags_title
ON tags (title);

ALTER TABLE tags
ADD CONSTRAINT unique_tags_title
UNIQUE USING INDEX tags_title;

CREATE TABLE post_tags
(
    id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    tag_id  UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE
);
