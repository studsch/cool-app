DROP TRIGGER IF EXISTS increment_count_trigger ON viewed_posts;
DROP FUNCTION IF EXISTS increment_count;

ALTER TABLE viewed_posts
    DROP CONSTRAINT viewed_posts_unique_user_id_post_id_key;
ALTER TABLE like_post
    DROP CONSTRAINT like_post_unique_user_id_post_id_key;
ALTER TABLE like_comment
    DROP CONSTRAINT like_comment_unique_user_id_comment_id_key;

DROP TABLE viewed_posts;
