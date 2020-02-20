"use strict";

const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const uuidv1 = require('uuid/v1'); // executer uuidv1() pour avoir un uuid
const connectMongo = require("connect-mongo");
const app = express();

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/src"));
app.use(cookieParser());

const MongoStore = connectMongo(expressSession)

const options = {
    store: new MongoStore({
        url: "mongodb://localhost:27017/jeu_mj"
    }),
    secret: "1234Secret",
    saveUninitialized: true,
    resave: false,
}

app.use(expressSession(options));


app.get("/", function (req, res) {
        
        // console.log('session==>', req.cookies)
        // if(req.cookies){
        //     MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
        //         let dbase = client.db("jeu_mj");
        //         let collect = dbase.collection("sessions");
        //         console.log(req.session);
                
        //     })
        // }
    res.render("home");
})

app.post("/auth", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
        if(err){
            console.log("erreur");
        }else{

        const uuid = uuidv1();



        // test si le joueur à saisie mdp et identifiant    
        if (req.body.identifiant === "" || req.body.mdp === "") {
            res.render("home", { message: "Veuillez saisir les informations" });
        };

        let db = client.db("jeu_mj");
        let collection = db.collection("Utilisateurs");
        let ident = req.body.identifiant;
        let motDePasse = req.body.mdp;
        let insertion = {};

        collection.find({ pseudo: ident }).toArray(function (err, data) {
            if (data.length) {

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

                //Creation de la session du joueur
                req.session.uuid = uuid;
                

                //insertion du joueur dans la data base Utilisateurs
                insertion.pseudo = ident;
                insertion.mdp = motDePasse;
                insertion.uuid = uuid;
                collection.insertOne(insertion, function (err, results) {
                    res.render("avatar", { mess: "Bienvenue " + ident });
                });
            }
        })

    }
    })
});








// app.get("/jeu", function(req, res){
//     res.render("jeu");
// })







const serverHTTP = app.listen(8080, function () {
    console.log("Serveur Démarré");
});

const io = require("socket.io");

const webSocketServer = io(serverHTTP);

webSocketServer.on("connect", function(socket){
    
})