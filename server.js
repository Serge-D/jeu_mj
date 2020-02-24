"use strict";

const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const uuidv1 = require("uuid/v1"); // executer uuidv1() pour avoir un uuid
const connectMongo = require("connect-mongo");
const app = express();

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/src"));
app.use("/images", express.static(__dirname + "/src/images"));
app.use(cookieParser());

const MongoStore = connectMongo(expressSession)

//variable pour la date d'expiration des cookies
var cookieExpiration = new Date( Date.now() + 3600 ); // 1 hour
console.log(cookieExpiration);
var sessionlife = 60 * 60* 1000;

const options = {
    store: new MongoStore({
        url: "mongodb://localhost:27017/jeu_mj"
    }),
    secret: "1234Secret",
    saveUninitialized: true,
    resave: false,
    expires: cookieExpiration,
    rolling: true, // reset maxAge on every response
    cookie: {
        maxAge: sessionlife,
        expires: new Date(Date.now() + sessionlife)
    },
}

app.use(expressSession(options));

app.use(function (req, res, next) {
    if(req.url == "/home" || req.url == "/auth"){
        next()
    }else{
        if(!req.session.userName){
            console.log("test")
            res.redirect("/home")
        }else{
            console.log("test2")
            next()
        }     
    }
}

  );

app.get("/home", function(req, res) {
    res.render("home");
})
app.get("/", function (req, res) {
        
        console.log('session==>', req.cookies)
        if(req.cookies){
            MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
                let dbase = client.db("jeu_mj");
                let collect = dbase.collection("sessions");
                console.log(req.session.userName);
                if(req.session.authentification === true){
                    res.redirect("/room")
                }else{
                    res.redirect("/home");
                }
            })
        }
    
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
        let collection = db.collection("utilisateurs");
        let ident = req.body.identifiant;
        let motDePasse = req.body.mdp;
        let insertion = {};

        collection.find({ pseudo: ident }).toArray(function (err, data) {
            if (data.length) {

                // console.log("ici" + data);
                let user = data[0];
                // console.log(user);
                    if(user.mdp === motDePasse){ // doit peut etre rajouter user.identifiant === ident
                        req.session.userName = user.pseudo // => user values?
                        req.session.authentification = true;
                        // req.session.cookie.expires = cookieExpiration
                        res.render("avatar", { mess: "Bienvenue " + req.session.userName });
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

app.get("/avatar", function(req, res){
    res.render("avatar", { mess: "Bienvenue " + req.session.userName });
    // console.log(req.body.image);
    // MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
    //     if(err){
    //         console.log("erreur");
    //     }else{
    //         let db = client.db("jeu_mj");
    //         let collection = db.collection("utilisateurs");
    //         collection.find().toArray(function(err, data){
    //             if(err){
    //                 next();
    //             }else{
    //                 res.render("jeu", {present: data[0].pseudo, image:req.body.image});
    //             }
    //         })

    //     }
    // });
});

app.post("/avatar", function(req, res){
    req.session.avatar = req.body.image // => user values?
    console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    res.redirect("/room")
    // res.render("jeu", {image:req.body.image});
    // // console.log(req.body.image);
    // MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
    //     if(err){
    //         console.log("erreur");
    //     }else{
    //         let db = client.db("jeu_mj");
    //         let collection = db.collection("utilisateurs");
    //         collection.find().toArray(function(err, data){
    //             if(err){
    //                 next();
    //             }else{
    //                 res.render("jeu", {image:req.body.image});
    //             }
    //         })

    //     }
    // });
});

app.get("/room", function(req, res){
    res.render("room")
})

app.post("/room", function(req, res){
    console.log("RRRRRRRRRRRRRRRRRRRRR")
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
        if(err){
            console.log("erreur")
        }
        let db = client.db("jeu_mj");
        let collection= db.collection("rooms");
        console.log("-----")
        console.log(req.body)
        console.log("-----")
        let nomDeLaPartie = req.body.roomname;
        let insertion= {};

        collection.find({nom: nomDeLaPartie}).toArray(function(err, data){
            if(!data.length){
                console.log("room inexistante");
                insertion.uuid = uuidv1();
                insertion.nom = nomDeLaPartie;
                insertion.maxJoueur = 2;
                insertion.minJoueur = 1;
                collection.insertOne(insertion, function(err, results){
                    console.log("room créée")
                })
            }
        })        
    })
})

app.post("/")

app.get("/jeu", function(req, res){
    console.log("ICI");
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
        let db = client.db("jeu_mj");
        let collection = db.collection("questions");
        collection.find().toArray(function(err, data){
            if(err){
                console.log("erreur");
            }else{
                
                res.render("jeu", {present:req.session.userName , image: req.session.avatar, question: data[0]});
            }
        })
    });
});









const serverHTTP = app.listen(8080, function () {
    console.log("Serveur Démarré");
});

const io = require("socket.io");

const webSocketServer = io(serverHTTP);

var rooms = ["Lobby"];

webSocketServer.on("connect", function(socket){
    // le socket correspond au tunnel de la personne connectée
    console.log("connected to the client");


    socket.on("create_room", function(room){
        // console.log(room)
        rooms.push(room);
        socket.emit("updaterooms", rooms, socket.room)
    });

    socket.join()

    // socket.on("switchRoom", function(newroom){
    //     var oldroom;
    //     oldroom = socket.room;
    //     socket.leave(socket.room);
    //     socket.join(newroom);
    //     socket.room = newroom;
    //     socket.emit("updaterooms", rooms, newroom);
    // });

    socket.on("disconnect", function(){
        socket.leave(socket.room);
    })

    
});