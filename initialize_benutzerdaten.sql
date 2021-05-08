CREATE TABLE benutzerdaten (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    benutzername TEXT NOT NULL, 
    passwort TEXT NOT NULL
);

INSERT INTO benutzerdaten (benutzername, passwort) VALUES ("Alice", "§$Y45/912v");
INSERT INTO benutzerdaten (benutzername, passwort) VALUES ("Bob", "secret");
INSERT INTO benutzerdaten (benutzername, passwort) VALUES ("Carla", "123");
INSERT INTO benutzerdaten (benutzername, passwort) VALUES ("David", "divaD");