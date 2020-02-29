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
var cookieExpiration = new Date(Date.now() + 3600); // 1 hour
console.log(cookieExpiration);
var sessionlife = 60 * 60 * 1000;

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
    if (req.url == "/home" || req.url == "/inscription" || req.url == "/connexion") {
        next()
    } else {
        if (!req.session.userName) {
            console.log("test")
            res.redirect("/home")
        } else {
            console.log("test2")
            next()
        }
    }
}

);

app.get("/home", function (req, res) {
    res.render("home");
})
app.get("/", function (req, res) {

    // console.log('session==>', req.cookies)
    if (req.cookies) {
        MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
            let dbase = client.db("jeu_mj");
            let collect = dbase.collection("sessions");
            console.log(req.session.userName);
            if (req.session.authentification === true) {
                res.redirect("/room")
            } else {
                res.redirect("/home");
            }
        })
    }

})


/******************** INSCRIPTION ET CONNEXION *******************************/

app.post("/inscription", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log("erreur")
        } else {

            // test si le joueur à saisie mdp et identifiant    
            if (req.body.identifiant === "" || req.body.mdp === "") {
                res.render("home", { message: "Veuillez saisir les informations" });
            } else {


                let db = client.db("jeu_mj");
                let collection = db.collection("utilisateurs");
                let ident = req.body.identifiant;
                let motDePasse = req.body.mdp;
                let insertion = {};
                let uuid = uuidv1();

                //Creation de la session du joueur
                req.session.uuid = uuid;
                req.session.authentification = true;
                req.session.userName = ident;

                //insertion du joueur dans la data base Utilisateurs
                insertion.pseudo = ident;
                insertion.mdp = motDePasse;
                insertion.uuid = uuid;
                insertion.score = [];
                collection.insertOne(insertion, function (err, results) {
                    res.cookie("user_id", uuid, { expires: new Date(Date.now() + 900000), httpOnly: false })
                    res.render("avatar", { mess: "Bienvenue " + ident });
                });
            }
        }
    })
});

app.post("/connexion", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log("erreur")
        }
        
        let db = client.db("jeu_mj");
        let collection = db.collection("utilisateurs");
        let ident = req.body.identifiant;
        let motDePasse = req.body.mdp;

        collection.find({ pseudo: ident}).toArray(function (err, data) {
            if (data.length) {
                console.log(data)
                let user = data[0]; // probleme si plusieurs personnes sont connectées le data[0] n'est plus bon ????? //semi réponse = si c'est ok si la session est ouverte

                if (user.mdp === motDePasse && user.pseudo === ident) {
                    req.session.userName = user.pseudo;
                    req.session.authentification = true;
                    res.cookie("user_id", user.uuid, { expires: new Date(Date.now() + 900000), httpOnly: false })

                    res.render("avatar", { message: "Bienvenue " + req.session.userName })
                } else {
                    res.render("home", { message: "Identifiants incorrects" })
                }
            }
        })
    })
});



/*****************************************************************************/

// app.post("/auth", function (req, res) {
//     MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
//         if(err){
//             console.log("erreur");
//         }else{

//         const uuid = uuidv1();



//         // test si le joueur à saisie mdp et identifiant    
//         if (req.body.identifiant === "" || req.body.mdp === "") {
//             res.render("home", { message: "Veuillez saisir les informations" });
//         };

//         let db = client.db("jeu_mj");
//         let collection = db.collection("utilisateurs");
//         let ident = req.body.identifiant;
//         let motDePasse = req.body.mdp;
//         let insertion = {};

//         collection.find({ pseudo: ident }).toArray(function (err, data) {
//             if (data.length) {

//                 // console.log("ici" + data);
//                 let user = data[0];
//                 // console.log(user);
//                     if(user.mdp === motDePasse){ // doit peut etre rajouter user.identifiant === ident
//                         req.session.userName = user.pseudo // => user values?
//                         req.session.authentification = true;
//                         // req.session.cookie.expires = cookieExpiration
//                         res.render("avatar", { mess: "Bienvenue " + req.session.userName });
//                         // req.session.pseudo
//                     }else{
//                         res.render("home", {message: "Identifiants incorrects / Identifiants déjà pris"});
//                     }
//             }
//             else {
//                 console.log("pseudo non trouvé")

//                 //Creation de la session du joueur
//                 req.session.uuid = uuid;


//                 //insertion du joueur dans la data base Utilisateurs
//                 insertion.pseudo = ident;
//                 insertion.mdp = motDePasse;
//                 insertion.uuid = uuid;
//                 collection.insertOne(insertion, function (err, results) {
//                     res.render("avatar", { mess: "Bienvenue " + ident });
//                 });
//             }
//         })

//     }
//     })
// });

app.get("/avatar", function (req, res) {
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

app.post("/avatar", function (req, res) {
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

app.get("/room", function (req, res) {
    res.render("room")
})

// app.post("/room", function (req, res) {
//     console.log("RRRRRRRRRRRRRRRRRRRRR")
//     MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
//         if (err) {
//             console.log("erreur")
//         }
//         let db = client.db("jeu_mj");
//         let collection = db.collection("rooms");
//         console.log("-----")
//         console.log(req.body)
//         console.log("-----")
//         let nomDeLaPartie = req.body.roomname;
//         let insertion = {};

//         collection.find({ nom: nomDeLaPartie }).toArray(function (err, data) {
//             if (!data.length) {
//                 console.log("room inexistante");
//                 insertion.uuid = uuidv1();
//                 insertion.nom = nomDeLaPartie;
//                 insertion.maxJoueur = 2;
//                 insertion.minJoueur = 1;
//                 insertion.nomDesJoueurs = [req.session.userName];
//                 collection.insertOne(insertion, function (err, results) {
//                     console.log("room créée")
//                 })
//             }
//         })
//     })
// });



app.get("/jeu", function (req, res) {
    res.render("jeu");
    //     console.log("ICI");
    //     MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
    //         let db = client.db("jeu_mj");
    //         let collection = db.collection("questions");
    //         collection.find().toArray(function(err, data){
    //             if(err){
    //                 console.log("erreur");
    //             }else{

    //                 res.render("jeu", {present:req.session.userName , image: req.session.avatar, question: data[0]});
    //             }
    //         })
    //     });
});


app.post("/game", function(req, res){
    // res.render("jeu", {present: req.session.userName, image: req.session.avatar})
    res.redirect("/game")
})

app.get("/game", (req, res)=>{
    res.render("jeu", {present: req.session.userName, image: req.session.avatar})
    
})





const serverHTTP = app.listen(8080, function () {
    console.log("Serveur Démarré");
});

const io = require("socket.io");

const webSocketServer = io(serverHTTP);
console.log(webSocketServer.nsps['/'].adapter.rooms)
var rooms = ["Lobby"];
console.log(io)
webSocketServer.on("connect", function (socket) {
    // le socket correspond au tunnel de la personne connectée
    console.log("connected to the client");

    /********* Partie avec nico  ***********/
    socket.on("create_room", function (room) {
        MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
            console.log("MONGOCLIENT")
            if (err) {
                console.log("Cannot connect to database");
            } else {
                // let db = client.db("jeu_mj");
                // let collection = db.collection("questions");
                // collection.find().toArray(function (err, data) {    
                console.log(room)
                socket.join(room);
                // })
            }
        })
        // socket.emit("updaterooms", rooms, socket.room);

    });
    socket.on("join_room", (room)=>{

        socket.join(room)
    })
    console.log(socket.adapter.rooms) // permet de voir toutes les rooms présentes

    // socket.on("questions", function(socketData){
    //     var questionsData = JSON.parse(socketData.utf8Data)
    //     MongoClient.connect("mongodb://localhost:27017",{ useUnifiedTopology: true },function(err, client){
    //         if(err){
    //             console.log("Cannot connect to database");
    //         }else{
    //             let db = client.db("jeu_mj");
    //             let collection = db.collection("questions");
    //             collection.find().toArray(function(err, data){
    //                 if(err){
    //                     console.log("impossible d'acceder a la collection")
    //                 }else{
    //                     data.forEach(function(){
    //                         socket.emit()
    //                     });
    //                 }
    //             });
    //         }
    //     });

    //     const questionsDataAsString = JSON.stringify(questionsData);
    //     establishedSockets.forEach(function (socket) {
    //       socket.sendUTF(questionsDataAsString);
    //     });

    // });

    // /**** partie pour quitter la room *****/ 
    socket.on("disconnect", function () {
        socket.leave(socket.room);
    })

    socket.on("start", function (room) {
        console.log(socket.adapter.rooms)
        console.log("RECU EMIT START GAME")
        console.log("room", room)
        console.log(webSocketServer.nsps['/'].adapter.rooms)
        console.log("bbbbbbbbbbbbbbb")
        console.log("bbbbbbbbbbbbbbb")
        socket.join(room)
        // var room = "room1"  // Premiere version
        // var room = ["Partie 1","Partie 2","Partie 3","Partie 4","Partie 5"];
        MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
            console.log("MONGOCLIENT")
            if (err) {
                console.log("Cannot connect to database");
            } else {
                let db = client.db("jeu_mj");
                let collection = db.collection("questions");
                collection.find().toArray(function (err, data) {
                    if (err) {
                        console.log("impossible d'acceder a la collection")
                    } else {
                        var questions = data
                        // console.log(data)
                        // console.log("YAQUOI")
                        var i = 0
                        console.log("------")
                        console.log(i)
                        console.log("------")
                        
                        
                        // console.log(question)
                        // console.log(response)
                        // socket.to(room).emit('questions', question)
                        // socket.to(room).emit('questions', response)
                        var testInterval = setInterval(() => {
                            var question = questions[i]
                            var response = Object.assign({}, questions[i]);
                            delete question["reponse"]
                            delete question.anecdote
                            console.log(socket)

                            console.log(i)
                            console.log(questions[i])
                            if (i >= 10) {
                                clearInterval(testInterval)
                                clearTimeout(testTimeout)
                                return
                            }
                            console.log("emit question", room, question)
                            webSocketServer.sockets.in(room).emit('questions', question)

                            var testTimeout = setTimeout(() => {
                                console.log("emit response", room, response)
                                webSocketServer.sockets.in(room).emit('response', response)
                            }, 3000)
                            i++
                        }, 6000);

                    }
                });
            }
        });
        console.log("YAQUOI")
    });
});
    // /******* Autre facon de faire
    // // socket.on("connexion", function(socket){
    // //     socket.join("room 1");
    // // });

    // // console.log(socket.adapter.rooms)

    // // socket.to("room1").emit("Bonjour");
    // ********/

    // /************* autre facon 
    // // // socket.join('room 237', () => {
    // // //     let rooms = Object.keys(socket.rooms);
    // // //     console.log(rooms); // [ <socket.id>, 'room 237' ]
    // // //     webSocketServer.to('room 237').emit('a new user has joined the room'); // broadcast to everyone in the room
    // // //  });
    // ***********/




    // /********** autre facon de faire encore ********/
    // // socket.on('create', function(room) {
    // //     socket.join(room);});

/*
/////Récuperation questions

MongoClient.connect("mongodb://localhost:27017",{useNewUrlParser: true}, (err,client)=>{
    if(err){
        console.log("Impossible d'acceder la base de données")
    }else{
        let db = client.db("jeu_mj");
        let collection = db.collection("questions");
        collection.find({}).toArray((err, data)=>{
            if(err){
                console.log("erreur récuperation");
            }else{
                questions = data
            }
        })
    }
})

*/