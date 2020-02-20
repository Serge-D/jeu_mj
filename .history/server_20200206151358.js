"use strict";

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.set("view engine", "pug");

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
    MongoClient
})








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