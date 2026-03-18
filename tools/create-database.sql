/* On default db (create user and new db) */
CREATE USER postit_admin WITH ENCRYPTED PASSWORD 'postitpass';
CREATE DATABASE postit_db OWNER postit_admin;
