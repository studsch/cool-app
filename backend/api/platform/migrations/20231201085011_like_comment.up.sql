create table like_comment
(
    id         uuid default uuid_generate_v4() not null,
    user_id    uuid                            not null
        constraint user_id_fk
            references users,
    comment_id uuid                            not null
        constraint comment_id_fk
            references comment
);
