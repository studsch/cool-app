create table like_post
(
    id         uuid default uuid_generate_v4() not null,
    user_id    uuid                            not null
        constraint user_id_fk
            references users,
    post_id uuid                            not null
        constraint post_id_fk
            references post
);
