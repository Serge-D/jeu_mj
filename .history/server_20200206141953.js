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









// app.get("/jeu", function(req, res){
//     res.render("jeu");
// })







const server = app.listen(8080, function(){
    console.log("Serveur Démarré");
});

const websocket = require("websocket");

const web