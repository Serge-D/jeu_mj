"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/src"));
app.use(cookieParser());
app.use(session({
    secret: "1234Secret",
    saveUninitialized: fatruelse,
    resave: false,
    cookie: { secure: true }
}));

app.get("/", function (req, res) {
    
    console.log('session==>', req.session)
    res.render("home");
})

app.post("/auth", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
        // test si le joueur à saisie mdp et identifiant    
        if (req.body.identifiant === "" || req.body.mdp === "") {
            res.render("home", { message: "Veuillez saisir les informations" });
        };

        let db = client.db("jeu_mj");
        let collection = db.collection("sessions");
        let ident = req.body.identifiant;
        let motDePasse = req.body.mdp;
        let insertion = {};

        collection.find({ pseudo: ident }).toArray(function (err, data) {
            if (data.length) {
                console.log("pseudo trouvé");
                console.log("ici" + data);
                let user = data[0];
                console.log(user);
                    if(user.mdp === motDePasse){
                        res.render("avatar", { mess: "Bienvenue " + ident });
                        // req.session.pseudo
                    }else{
                        res.render("home", {message: "Identifiants incorrects / Identifiants déjà pris"});
                    }
            }
            else {
                console.log("pseudo non trouvé")
                insertion.pseudo = ident;
                insertion.mdp = motDePasse;
                collection.insertOne(insertion, function (err, results) {
                    res.render("avatar", { mess: "Bienvenue " + ident });
                });
            }
        })

    })
});








// app.get("/jeu", function(req, res){
//     res.render("jeu");
// })







const serverHTTP = app.listen(8080, function () {
    console.log("Serveur Démarré");
});

const websocket = require("websocket");

const WebSocketServer = websocket.server;

const websocketserver = new WebSocketServer({
    httpServer: serverHTTP,
    autoAcceptConnections: false
});

websocketserver.on("request", function(webSocketRequest){
    websocketserver;

    var acceptProtocol = "sergeJM";
    var allowedOrigin = websocketserver.origin;

    var webSocketConnection = webSocketRequest.accept(acceptProtocol, allowedOrigin);
});