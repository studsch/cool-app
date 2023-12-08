create table comment
(
    id               uuid        default uuid_generate_v4() not null
        constraint comment_pk
            primary key,
    user_id          uuid                                   not null
        constraint user_id_fk
            references users,
    post_id          uuid                                   not null
        constraint post_id_fk
            references post,
    reply_to_user_id uuid        default null
        constraint reply_to_fk
            references users,
    content          varchar(180)                           not null,
    deleted          bool        default false,
    created_at       timestamptz default now()              not null
);
