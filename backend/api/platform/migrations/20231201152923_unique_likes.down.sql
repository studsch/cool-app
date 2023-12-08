alter table like_post
    drop constraint like_post_user_id_post_id_key;

alter table like_comment
    drop constraint like_comment_user_id_comment_id_key;
