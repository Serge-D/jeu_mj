"use strict";

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.set("view engine", "pug");
app.use("/css",express.static(__dirname+"/"));


app.get("/", function(req, res){
    res.render("home");
})








app.listen(8080, function(){
    console.log("Serveur Démarré");
});

