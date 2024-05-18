CREATE TABLE IF NOT EXISTS chats
(
    id         UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
    user1_id   UUID                     NOT NULL REFERENCES users (id),
    user2_id   UUID                     NOT NULL REFERENCES users (id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages
(
    id                UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
    body              TEXT                     NOT NULL,
    sender_id    UUID                     NOT NULL REFERENCES users (id),
    chat_id           UUID                     NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
    time              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE chats
ADD UNIQUE (user1_id, user2_id);
