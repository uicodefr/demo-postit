-- # GLOBAL # --

INSERT INTO global_user (username, password, enabled) VALUES
    ('admin', '$2a$10$DvPfBzqUbcoiC3wDA8FFP.Tuoz/MV/2T0Dn.bWWAAzoyashi5uh6K', true),
    ('superadmin', '$2a$10$pV/Wt0NnfjDJoOxZ2cqcn.OCj9qd.Xx0yTCs.PVPVs/9nPLlwbj8S', true);

INSERT INTO global_user_authority (authority) VALUES
    ('ROLE_BOARD_WRITE'), ('ROLE_USER_WRITE');

INSERT INTO global_link_user_authority (user_id, user_authority_id) VALUES
    (1, 1), (2, 1), (2, 2);
