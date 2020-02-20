"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+"/src"));
app.use(cookieParser());
app.use(session({
    secret: "1234Secret",
    saveUninitialized: true,
    resave: false
}));

app.get("/", function(req, res){
    res.render("home");
})

app.post("/", function(req, res){
    MongoClient.connect("mongodb://localhost:27017",{useUnifiedTopology: true},function(err, client){
        if(req.body.identifiant === "" || req.body.mdp === ""){
            res.render("home",{message: "Veuillez saisir les informations"});
        };
        
        let db = client.db("jeu_mj");
        let collection = db.collection("sessions");
        let insertion = {};
        console.log(req.body)
        // test si le joueur à saisie mdp et identifiant 
        if(){

        }
        else{
            insertion.pseudo = req.body.identifiant;
            insertion.mdp = req.body.mdp;
            collection.insertOne(insertion, function(err, results){
                console.log(results);
            });
        }

    })
});








// app.get("/jeu", function(req, res){
//     res.render("jeu");
// })







const serverHTTP = app.listen(8080, function(){
    console.log("Serveur Démarré");
});

const websocket = require("websocket");

const WebSocketServer = websocket.server;

const websocketserver = new WebSocketServer({
    httpServer: serverHTTP,
    autoAcceptConnections : false
});