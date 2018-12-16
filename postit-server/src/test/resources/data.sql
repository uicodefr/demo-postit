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

-- # ONE BOARD # --

INSERT INTO postit_board
(id, name, creation_date, update_date) VALUES
    (nextval('postit_board_id_seq'), 'Test Board', NOW(), NOW());

-- # ONE NOTE # --

INSERT INTO postit_note
(id, creation_date, update_date, name, text_value, postit_board_id, update_text_date, color, order_num) VALUES
    (nextval('postit_note_id_seq'), NOW(), NOW(), 'Test Note', 'Test Content', 1, NOW(), 'yellow', 1);