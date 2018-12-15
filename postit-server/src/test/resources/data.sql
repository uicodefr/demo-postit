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
