CREATE TABLE viewed_posts
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    post_id    UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    view_count INT  NOT NULL    DEFAULT 1
);

ALTER TABLE viewed_posts
    ADD CONSTRAINT viewed_posts_unique_user_id_post_id_key
        UNIQUE (user_id, post_id);

CREATE OR REPLACE FUNCTION increment_count()
    RETURNS TRIGGER AS
$$
BEGIN
    IF EXISTS (SELECT 1
               FROM viewed_posts
               WHERE user_id = new.user_id
                 AND post_id = new.post_id) THEN
        UPDATE viewed_posts
        SET view_count = view_count + 1
        WHERE user_id = new.user_id
          AND post_id = new.post_id;
        RETURN NULL;
    ELSE
        RETURN new;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_count_trigger
    BEFORE INSERT
    ON viewed_posts
    FOR EACH ROW
EXECUTE FUNCTION increment_count();

ALTER TABLE like_post
    ADD CONSTRAINT like_post_unique_user_id_post_id_key
        UNIQUE (user_id, post_id);

ALTER TABLE like_comment
    ADD CONSTRAINT like_comment_unique_user_id_comment_id_key
        UNIQUE (user_id, comment_id);
