create table ping (id bigint);

CREATE TABLE "public"."user" (
    "id" uuid NOT NULL,
    "name" varchar(80) NOT NULL,
    "phone" varchar(16) NOT NULL,
    "password" text NOT NULL,
    "created_at" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."follow" (
    "id" uuid NOT NULL,
    "follower_id" uuid NOT NULL,
    "followed_id" uuid NOT NULL,
    "follow_date" timestamptz NOT NULL,
    CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id"),
    CONSTRAINT "follow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "public"."user"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."post" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "description" varchar(180),
    "location" varchar(80),
    "archived" bool NOT NULL DEFAULT false,
    "deleted" bool NOT NULL DEFAULT false,
    "created_at" timestamptz NOT NULL,
    CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."comment" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "post_id" uuid NOT NULL,
    "reply_to_user_id" uuid,
    "content" varchar(360) NOT NULL,
    "deleted" bool NOT NULL DEFAULT false,
    "created_at" timestamptz NOT NULL,
    CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id"),
    CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."like_post" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "post_id" uuid NOT NULL,
    CONSTRAINT "like_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id"),
    CONSTRAINT "like_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."like_comment" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "comment_id" uuid NOT NULL,
    CONSTRAINT "like_comment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id"),
    CONSTRAINT "like_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id"),
    PRIMARY KEY ("id")
);
