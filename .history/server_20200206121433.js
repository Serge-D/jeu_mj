"use strict";

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/src`);


app.get("/", function())








app.listen(8080, function(){
    console.log("Serveur Démarré");
});

