alter table like_post
    add unique (user_id, post_id);

alter table like_comment
    add unique (user_id, comment_id);
