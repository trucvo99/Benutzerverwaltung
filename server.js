const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

const DATABASE = "benutzerdaten.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

app.listen(3000, function(){
    console.log("server startet on port 3000");
});


// GET-Method: Anzeige der Tabelle
app.get("/benutzertabelle", function(req, res){
    db.all(
        `SELECT * FROM benutzerdaten`,
        function(err, rows){
            res.render("benutzertabelle", {"benutzerdaten": rows})
        }
    );
});


// HINZUFÜGEN EINES BENUTZERS UND DERREN PASSWORTS
// GET-Method: Formular zum Datenhinzufügen
app.get("/hinzufuegen", function(req, res){
    res.sendFile(__dirname + "/views/hinzufuegen.html");
});

// POST-Request: Hinzufügen eines Benutzer
app.post("/benutzerhinzufuegen", function(req, res){
    const param_name = req.body.namehinzufuegen;
    const param_pass = req.body.passhinzufuegen;

    db.all(
        `SELECT * FROM benutzerdaten WHERE benutzername = "${param_name}" `,
        function(err, rows){
            // Überprufen, ob der Benutzername schon existiert ist
            // Wenn kein derselbe Benutzername gibt, werden der neue Benutzername und das Passwort hinzugefügt
            if (rows.length == 0){
                db.run(
                    `INSERT INTO benutzerdaten (benutzername, passwort) VALUES ("${param_name}", "${param_pass}")`,
                    function(err){
                        res.redirect("/benutzertabelle");
                    }
                );
            // passiert, wenn der Benutzername schon existiert ist.
            } else {
                res.render("ist_existiert", {"namehinzufuegen": param_name});
            }
        });
});


// LOGIN
// GET-Method: Formular zum Login
app.get("/login", function(req, res){
    res.sendFile(__dirname + "/views/login.html");
});


// POST-Request: LOGIN
app.post("/logindaten", function(req, res){
    const param_name = req.body.loginname;
    const param_pass = req.body.loginpass;
    db.all(
        `SELECT * FROM benutzerdaten`,
        function(err, rows){
            for (const daten of rows){
                if (daten.benutzername == param_name){
                    if (daten.passwort == param_pass) {
                        return res.render("login_erfolgreich", {"loginname": param_name, "loginpass": param_pass});
                        //loginname và loginpass ở đây là biến ở login.html và login_erfolgreich.ejs
                    } else {
                        return res.render("login_fehler");
                    }
                }
            }
            return res.render("name_nicht_existiert", {"loginname": param_name});
        }
    )
});


// POST-Request: Löschen eines Benutzer
app.post("/delete/:id", function(req, res){
    db.run(
        `DELETE FROM benutzerdaten WHERE id=${req.params.id}`,
        function(err){
            res.redirect("/benutzertabelle");
        }
    );
});


// POST-Request für Daten-Update in der Benutzertabelle
app.post("/update/:id", function(req, res){
    db.all(
        `SELECT * FROM benutzerdaten WHERE id = ${req.params.id}`,
        function(err, rows){
            res.render("update", rows[0]);
        }
    );
});


// POST-Request für das Formular Daten-Update
app.post("/datenupdate/:id", function(req, res){
    const param_name = req.body.nameupdate;
    const param_passwort = req.body.passupdate;
    const param_id = req.params.id;
    db.run(
        `UPDATE benutzerdaten SET benutzername="${param_name}", passwort="${param_passwort}" WHERE id=${param_id}`,
        function(err){
            res.redirect("/benutzertabelle");
        }
    );
});