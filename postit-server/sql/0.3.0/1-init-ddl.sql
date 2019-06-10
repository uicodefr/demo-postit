-- # GLOBAL # --

CREATE TABLE global_user (
    id bigserial PRIMARY KEY,
    username varchar(256) NOT NULL UNIQUE,
    password varchar(256) NOT NULL,
    enabled boolean NOT NULL DEFAULT false
);

CREATE TABLE global_user_authority (
    id bigserial PRIMARY KEY,
    authority varchar(256) NOT NULL
);

CREATE TABLE global_link_user_authority (
    user_id bigint NOT NULL references postit_board(id),
    user_authority_id bigint NOT NULL references postit_board(id),
    PRIMARY KEY(user_id, user_authority_id)
);