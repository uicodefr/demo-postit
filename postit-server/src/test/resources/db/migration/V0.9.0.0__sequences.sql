-- Create Sequences for h2

CREATE SEQUENCE IF NOT EXISTS global_like_id_seq;
ALTER SEQUENCE global_like_id_seq RESTART WITH (select max(id)+1 FROM global_like);

CREATE SEQUENCE IF NOT EXISTS global_user_authority_id_seq;
ALTER SEQUENCE global_user_authority_id_seq RESTART WITH (select max(id)+1 FROM global_user_authority);

CREATE SEQUENCE IF NOT EXISTS global_user_id_seq;
ALTER SEQUENCE global_user_id_seq RESTART WITH (select max(id)+1 FROM global_user);

CREATE SEQUENCE IF NOT EXISTS postit_attached_file_id_seq;
ALTER SEQUENCE postit_attached_file_id_seq RESTART WITH (select max(id)+1 FROM postit_attached_file);

CREATE SEQUENCE IF NOT EXISTS postit_board_id_seq;
ALTER SEQUENCE postit_board_id_seq RESTART WITH (select max(id)+1 FROM postit_board);

CREATE SEQUENCE IF NOT EXISTS postit_note_id_seq;
ALTER SEQUENCE postit_note_id_seq RESTART WITH (select max(id)+1 FROM postit_note);
