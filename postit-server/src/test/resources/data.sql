-- # GLOBAL # --

INSERT INTO global_parameter (name, value, client_view) VALUES
    ('general.status', 'true', false);

INSERT INTO global_parameter (name, value, client_view) VALUES
    ('like.max', '1000', false);

-- # POST IT # --

INSERT INTO global_parameter (name, value, client_view) VALUES 
    ('board.max', '5', true);

INSERT INTO global_parameter (name, value, client_view) VALUES
    ('note.max', '40', true);

INSERT INTO global_parameter (name, value, client_view) VALUES
    ('user.max', '5', true);

-- # ONE BOARD # --

INSERT INTO postit_board (id, name, order_num, creation_date, update_date) VALUES
    (nextval('postit_board_id_seq'), 'Test Board', 1, NOW(), NOW());

-- # TWO NOTE # --

INSERT INTO postit_note
(id, creation_date, update_date, name, text_value, postit_board_id, update_text_date, color, order_num) VALUES
    (nextval('postit_note_id_seq'), NOW(), NOW(), 'Test Note 1', 'Test Content 1', 1, NOW(), 'yellow', 1);

INSERT INTO postit_note
(id, creation_date, update_date, name, text_value, postit_board_id, update_text_date, color, order_num) VALUES
    (nextval('postit_note_id_seq'), NOW(), NOW(), 'Test Note 2', 'Test Content 2', 1, NOW(), 'blue', 2);

-- # ONE ATTACHED FILE # --

INSERT INTO postit_attached_file
(id, creation_date, update_date, filename, size, mime_type) VALUES
    (nextval('postit_attached_file_id_seq'), NOW(), NOW(), 'test.txt', 7, 'text/plain');

INSERT INTO postit_attached_file_data
(id, data) VALUES (currval('postit_attached_file_id_seq'), '436f6e74656e74');

UPDATE postit_note SET attached_file_id = currval('postit_attached_file_id_seq') WHERE id = currval('postit_note_id_seq');
    
-- # USERS # --

INSERT INTO global_user (id, username, password, enabled) VALUES
    (nextval('global_user_id_seq'), 'admin', '$2a$10$DvPfBzqUbcoiC3wDA8FFP.Tuoz/MV/2T0Dn.bWWAAzoyashi5uh6K', true),
    (nextval('global_user_id_seq'), 'superadmin', '$2a$10$pV/Wt0NnfjDJoOxZ2cqcn.OCj9qd.Xx0yTCs.PVPVs/9nPLlwbj8S', true);

INSERT INTO global_user_authority (id, authority) VALUES
    (nextval('global_user_authority_id_seq'), 'ROLE_BOARD_WRITE'),
    (nextval('global_user_authority_id_seq'), 'ROLE_USER_WRITE');

INSERT INTO global_link_user_authority (user_id, user_authority_id) VALUES
    (1, 1), (2, 1), (2, 2);
