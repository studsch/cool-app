CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET TIMEZONE = "Europe/Moscow";

CREATE TABLE follow
(
    id            UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id     UUID                                 NOT NULL
        CONSTRAINT post_users_id_fk
            REFERENCES users,
    user_id_to     UUID                                 NOT NULL
        CONSTRAINT post_users_id_to_fk
            REFERENCES users,
    follow_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
