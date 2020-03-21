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

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(__dirname + "/src"));
app.use("/images", express.static(__dirname + "/src/images"));
app.use(cookieParser());

const MongoStore = connectMongo(expressSession)

//variables pour la date d'expiration des cookies et pour la durée de la session
var cookieExpiration = 60 * 60 * 1000; // 1 hour
console.log(cookieExpiration);
var sessionlife = 60 * 60 * 1000;

const options = {
    store: new MongoStore({
        url: "mongodb://localhost:27017/jeu_mj"
    }),
    secret: "1234Secret",
    saveUninitialized: true,
    resave: false,
    expires: new Date(Date.now() + cookieExpiration),
    rolling: true, // reset maxAge on every response
    cookie: {
        maxAge: sessionlife,
        expires: new Date(Date.now() + sessionlife)
    },
}


var questions;

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
                questions = data
            }
        });
    }
});

var user;

MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.log("error");
    } else {
        let db = client.db("jeu_mj");
        let collection = db.collection("utilisateurs");
        collection.find({}, { projection: { uuid: 1, pseudo: 1 } }).toArray(function (err, data) {
            if (err) {
                console.log("erreur acces");
            } else {
                // var pseudoPlayer= data[0].pseudo;
                console.log(data)
                user = data;
            }

        })
    }
})
console.log(user)
console.log(questions)

app.use(expressSession(options));


app.use(function (req, res, next) {
    if (req.url == "/home" || req.url == "/inscription" || req.url == "/connexion") {
        next()
    } else {
        if (!req.session.userName) {
            console.log("test")
            res.cookie("user_id", "", {
                expires: new Date(Date.now() + 900000),
                httpOnly: false
            })
            res.redirect("/home")
        } else {
            console.log("test2")
            res.cookie("user_id", req.session.uuid, {
                expires: new Date(Date.now() + 900000),
                httpOnly: false
            })
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
        MongoClient.connect("mongodb://localhost:27017", {
            useUnifiedTopology: true
        }, function (err, client) {
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
        let db= client.db("jeu_mj");
        let collection = db.collection("utilisateurs")
        if (err) {
            console.log("erreur")
        } else {

            // test si le joueur à saisie mdp et identifiant    
            if (req.body.identifiant === "" || req.body.mdp === "") {
                res.render("home", {
                    message: "Veuillez saisir les informations"
                });
            }
            collection.find({ pseudo: req.body.identifiant }).toArray(function (err, data){
                    console.log(data.length)  
                    if(data.length){
                        res.render("home", {
                            message: "Identifiant déjà pris"
                        })
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

                    collection.insertOne(insertion, function (err, results) {
                        res.cookie("user_id", uuid, {
                            expires: new Date(Date.now() + 900000),
                            httpOnly: false
                        })
                        res.render("room");
                    });
                }
            })
        }
    })
});

app.post("/connexion", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log("erreur")
        }

        if (req.body.identifiant === "" || req.body.mdp === "") {
            res.render("home", {
                message: "Veuillez saisir les informations"
            })
        }

        let db = client.db("jeu_mj");
        let collection = db.collection("utilisateurs");
        let ident = req.body.identifiant;
        let motDePasse = req.body.mdp;

        collection.find({ pseudo: ident }).toArray(function (err, data) {
            if (data.length) {
                console.log(data)
                let user = data[0]; // probleme si plusieurs personnes sont connectées le data[0] n'est plus bon ????? //semi réponse = si c'est ok si la session est ouverte
                console.log(data[0])
                if (user.mdp === motDePasse) {
                    req.session.userName = user.pseudo;
                    req.session.authentification = true;
                    req.session.uuid = user.uuid
                    res.cookie("user_id", user.uuid, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: false
                    })

                    res.render("room")
                } else {
                    res.render("home", {
                        message: "Identifiants incorrects"
                    })
                }
            }
        })
    })
});





// app.get("/avatar", function (req, res) {
//     res.render("avatar", {
//         mess: "Bienvenue " + req.session.userName
//     });
// });



// app.post("/avatar", function (req, res) {
//     req.session.avatar = req.body.image // => user values?
//     console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
//     res.redirect("/room")
// });

app.get("/room", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log("erreur avec mongo")
        } else {
            let db = client.db("jeu_mj");
            let collection = db.collection("scores");
            let insertion = {};
            insertion.pseudo = req.session.userName;
            insertion.uuid = req.session.uuid;
            insertion.score = 0;
            insertion.socketid;
            collection.insertOne(insertion, function (err, results) {
                if (err) {
                    console.log("erreur d'insertion")
                } else {
                    console.log("ca marche")
                }
            })
        }
    })
    res.render("room")
})

app.post("/room", function (req, res) {
    req.session.avatar = req.body.image;
})


// app.get("/jeu", function (req, res) {
//     res.render("jeu");
// });


// app.post("/game", function (req, res) {
//     // res.render("jeu", {present: req.session.userName, image: req.session.avatar})
//     res.redirect("/game")
// })

// app.get("/game", (req, res) => {

//     res.render("jeu", {
//         present: req.session.userName,
//         image: req.session.avatar
//     })

// })





const serverHTTP = app.listen(8080, function () {
    console.log("Serveur Démarré");
});

const io = require("socket.io");

const webSocketServer = io(serverHTTP);


const rooms = [
    {nom: "Partie-1", joueurs:[]},
    {nom: "Partie-2", joueurs:[]}
]
var rechercheRoom = function(roomName){
    for(let i=0; i < rooms.length;i++){
        if(rooms[i].nom == roomName){
            return rooms[i];
        }
    }
}

webSocketServer.on("connect", function (socket) {
    // le socket correspond au tunnel de la personne connectée
    console.log("connected to the client");

    socket.on("joinroom", function (roomName, uuidPlayer, avatar) {
        var room = rechercheRoom(roomName)
        console.log(roomName);
        console.log(uuidPlayer);
        console.log(socket.id)


        var pseudo = user.find(joueur => joueur.uuid === uuidPlayer).pseudo
        console.log(pseudo)

        if(room.joueurs.length < 2){
            var joueur = {
                pseudo : pseudo,
                uuid : uuidPlayer,
                score : 0,
                avatar : avatar,
                roomName : roomName,
                socketId : socket.id, 
            }
        }
        socket.joueur = joueur;
        room.joueurs.push(joueur);
        console.log(room.joueurs.length)
        console.log(room)
        console.log("PPPP")
        console.log(socket.joueur)
        socket.join(roomName);


        if(room.joueurs.length === 1){
            var attente = "Vous êtes seul";
            webSocketServer.sockets.to(roomName).emit("attente", attente, room)
        }
        if(room.joueurs.length === 2){
            var message = "La partie va pouvoir commencer";
            webSocketServer.sockets.to(roomName).emit("message", message, room)
        }
        if(room.joueurs.length > 2){
            var alerte = "Room pleine";
            webSocketServer.sockets.to(socket.id).emit("alerte", alerte)
        }
        // VRA
        // 0) un seul evenement 'joinroom', le discriminant c'est le nom de la room passé en argument
        // 1) récupérer le pseudo et autres data du joueur grâce à l'uuid
        // 2) find de la room dans la liste 'rooms' 
        // 3) alimenter la room avec le joueur
        
        /* TODO
       1)  uuid avec cookie 
        2)chercher la room correspondante par exemple roomOne.nom = roomName
        3)if (rooms[?].joueurs.length < 2) { 
        
            var joueur = { 
                pseudo:session.pseudo,
                uuid: uuidPlayer, // si besoin
                score: 0,
                avatar: avatar,
                roomName : roomName,
                socketid : socket.id
                //etc... si besoin
            }

            socket.joueur = joueur //Important !

            rooms[indice].joueurs.push(joueurs) // syntaxe push à vérifier
            socket.join(room);            
            webSocketServer.sockets.in(room).emit('joueur', roomOne)
            if (rooms[indice].joueurs.length === 1) {
                var attente = "Vous êtes seul";
                webSocketServer.sockets.to(socket.id).emit("attente", attente, joueur);
            }
        } else 
        {
            var message = "Room pleine";
            webSocketServer.sockets.to(socket.id).emit("message", message);
                        
        }
        */       
         
        

    })

    
    socket.on("start", function (room) {
        console.log(room)
        /* VRA -- supprimer
        if (webSocketServer.sockets.adapter.rooms[room]["start"] == true) {
            return
        } else {
            webSocketServer.sockets.adapter.rooms[room]["start"] = true
        }

        console.log("bbbbbbbbbbbbbbb")
        console.log(socket.adapter.rooms)
        console.log("RECU EMIT START GAME")
        console.log("room", room)
        console.log(webSocketServer.sockets.adapter.rooms)

        console.log(webSocketServer.nsps['/'].adapter.rooms)
        console.log("bbbbbbbbbbbbbbb")
        // socket.join(room)
        console.log(socket.rooms)
        
        console.log(webSocketServer.sockets.adapter.rooms)
        */
       var i =0;

        var testInterval = setInterval(() => {
            var question = questions[i];
            var response = Object.assign({}, questions[i]);



            // console.log(i)
            // console.log(questions[i])
            if (i >= 10) {
                //enregistrer mes scores 
                
                
                clearInterval(testInterval);
                clearTimeout(testTimeout);
                return
            }
            // console.log("----LALA----")
            // console.log(room)
            // console.log("emit question", room, question)
            // console.log("----LALA----")
            webSocketServer.sockets.in(room).emit('questions', question);

            var testTimeout = setTimeout(() => {
                // console.log("------------ICI------------")
                // console.log("emit response", room, response)
                // console.log("------------ICI------------")
                webSocketServer.sockets.in(room).emit('response', response)
            }, 3000)
            i++
            // console.log("-----TAPUTINDETAMERE-------")
            // console.log(i)
            // console.log("-----TAPUTINDETAMERE-------")
        }, 6000);


        console.log("YAQUOI")
    });

    socket.on("reponse", function (data) {
        let solution = questions[parseFloat(data.question.split("question ")[1]) - 1].solution;
        console.log("//////////////////////")
        console.log(data);
        console.log(socket.id)
        console.log(solution);
        console.log("///////////////////////")
        if (solution == data.reponse) {

            console.log("score + 1!")
            var room = rechercheRoom(socket.joueur.roomName);
            socket.joueur.score += 1;
            console.log("////////")
            console.log(room.joueurs)
            console.log("////////")
            

            webSocketServer.sockets.in(data.room).emit("scores", room.joueurs)

     
        }
    })


    socket.on("deconnexion", function(){
        socket.disconnect();
    })







});


