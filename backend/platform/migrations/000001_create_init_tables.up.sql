CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET TIMEZONE = "Europe/Moscow";

-- Create users table
CREATE TABLE users
(
    id            UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone         varchar(16)  NOT NULL,
    password_hash varchar(255) NOT NULL,
    name          varchar(80)  NOT NULL,
    surname       varchar(80)  NOT NULL,
    date_of_birth TIMESTAMP    NOT NULL,
    gender        varchar(10)  NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP    NULL,
    user_role     varchar(10)  NOT NULL,
    deleted       BOOLEAN      NULL
);

CREATE TABLE post
(
    id          UUID      DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT post_pk
            PRIMARY KEY,
    user_id     UUID                                 NOT NULL
        CONSTRAINT post_users_id_fk
            REFERENCES users,
    description VARCHAR(256),
    location    VARCHAR(180),
    created_at  TIMESTAMP DEFAULT now()              NOT NULL,
    archived    BOOLEAN   DEFAULT false,
    deleted     BOOLEAN   DEFAULT false
);
