-- # Cleans boards an notes # --
ALTER TABLE global_link_user_authority
    DROP CONSTRAINT CONSTRAINT_5B;
ALTER TABLE global_link_user_authority
    DROP CONSTRAINT CONSTRAINT_5BF;

DELETE FROM postit_note;
DELETE FROM postit_board;

ALTER SEQUENCE postit_note_id_seq RESTART WITH 1;
ALTER SEQUENCE postit_board_id_seq RESTART WITH 1;

-- # Add One Board # --

INSERT INTO postit_board (id, name, order_num, creation_date, update_date) VALUES
    (nextval('postit_board_id_seq'), 'Test Board', 1, NOW(), NOW());

-- # Add Two Notes # --

INSERT INTO postit_note
(id, creation_date, update_date, name, text_value, postit_board_id, update_text_date, color, order_num) VALUES
    (nextval('postit_note_id_seq'), NOW(), NOW(), 'Test Note 1', 'Test Content 1', 1, NOW(), 'yellow', 1);

INSERT INTO postit_note
(id, creation_date, update_date, name, text_value, postit_board_id, update_text_date, color, order_num) VALUES
    (nextval('postit_note_id_seq'), NOW(), NOW(), 'Test Note 2', 'Test Content 2', 1, NOW(), 'blue', 2);

-- # Add One Attached File # --
    
INSERT INTO postit_attached_file
(id, creation_date, update_date, filename, size, mime_type) VALUES
    (nextval('postit_attached_file_id_seq'), NOW(), NOW(), 'test.txt', 7, 'text/plain');

INSERT INTO postit_attached_file_data
(id, data) VALUES (1, '436f6e74656e74');

UPDATE postit_note SET attached_file_id = 1 WHERE id = 2;
