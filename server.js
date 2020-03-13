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
    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client) {
        if (err) {
            console.log("erreur")
        } else {

            // test si le joueur à saisie mdp et identifiant    
            if (req.body.identifiant === "" || req.body.mdp === "") {
                res.render("home", {
                    message: "Veuillez saisir les informations"
                });
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
                // insertion.score = [];
                collection.insertOne(insertion, function (err, results) {
                    res.cookie("user_id", uuid, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: false
                    })
                    res.render("avatar", {
                        mess: "Bienvenue " + ident
                    });
                });
            }
        }
    })
});

app.post("/connexion", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client) {
        if (err) {
            console.log("erreur")
        }

        let db = client.db("jeu_mj");
        let collection = db.collection("utilisateurs");
        let ident = req.body.identifiant;
        let motDePasse = req.body.mdp;

        collection.find({pseudo: ident}).toArray(function (err, data){
            if (data.length) {
                console.log(data)
                let user = data[0]; // probleme si plusieurs personnes sont connectées le data[0] n'est plus bon ????? //semi réponse = si c'est ok si la session est ouverte

                if (user.mdp === motDePasse && user.pseudo === ident) {
                    req.session.userName = user.pseudo;
                    req.session.authentification = true;
                    req.session.uuid = user.uuid
                    res.cookie("user_id", user.uuid, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: false
                    })

                    res.render("avatar", {
                        message: "Bienvenue " + req.session.userName
                    })
                } else {
                    res.render("home", {
                        message: "Identifiants incorrects"
                    })
                }
            }
        })
    })
});





app.get("/avatar", function (req, res) {
    res.render("avatar", {
        mess: "Bienvenue " + req.session.userName
    });
});



app.post("/avatar", function (req, res) {
    req.session.avatar = req.body.image // => user values?
    console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    res.redirect("/room")
});

app.get("/room", function (req, res) {
    res.render("room")
})



app.get("/jeu", function (req, res) {
    res.render("jeu");
});


app.post("/game", function (req, res) {
    // res.render("jeu", {present: req.session.userName, image: req.session.avatar})
    res.redirect("/game")
})

app.get("/game", (req, res) => {
    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client){
        if(err){
            console.log("erreur avec mongo")
        }else{
            let db = client.db("jeu_mj");
            let collection = db.collection("scores");
            let insertion = {};
            insertion.pseudo = req.session.userName;
            insertion.uuid = req.session.uuid;
            var score = 0; 
            insertion.score = score;
            collection.insertOne(insertion, function(err,results){
                if(err){
                    console.log("erreur d'insertion")
                }else{
                    console.log("ca marche")
                }
            })
        }
    })
    res.render("jeu", {
        present: req.session.userName,
        image: req.session.avatar
    })

})




const serverHTTP = app.listen(8080, function () {
    console.log("Serveur Démarré");
});

const io = require("socket.io");

const webSocketServer = io(serverHTTP);



var rooms = [];

webSocketServer.on("connect", function (socket) {
    // le socket correspond au tunnel de la personne connectée
    console.log("connected to the client");
    

    socket.on("create_room1", function(room){
        console.log("yal1111111")
        console.log(room)
        console.log(room)
        console.log(socket.rooms)
        console.log(socket.id) 
        console.log("yalaaaaaa")
        socket.join(room)
        
        socket.emit("updaterooms", room, socket.rooms, socket.id)
    })
    

    
    socket.on("create_room2", function(room){
        console.log("yal222222")
        console.log(room)
        console.log(socket.rooms) 
        console.log("yalaaaaaa")
        socket.join(room)

        socket.emit("updaterooms", room, socket.rooms)
    })
    
    
    socket.on("create_room3", function(room){
        console.log("yal333333")
        console.log(room)
        console.log(socket.rooms) 
        console.log("yalaaaaaa")
        socket.join(room)

        socket.emit("updaterooms", room, socket.rooms)
    })

    
    socket.on("create_room4", function(room){
        console.log("yal444444")
        console.log(room)
        console.log(socket.rooms) 
        console.log("yalaaaaaa")
        socket.join(room)

        socket.emit("updaterooms", room, socket.rooms)
    })

    
    socket.on("create_room5", function(room){
        console.log(room)
        console.log("yal555555")
        console.log(socket.rooms) 
        console.log("yalaaaaaa")
        socket.join(room)

        if (webSocketServer.sockets.adapter.rooms[room]) 
            {
            // result
            console.log("test")
            console.log(webSocketServer.sockets.adapter.rooms[room].length);
            }

        socket.emit("updaterooms", room, socket.rooms)
    })




  
    socket.on("create_room", function (roomName) {
        console.log("ici c'est les rooms")
        console.log(roomName)
        console.log("------------------")
        socket.join(roomName);

        var room = webSocketServer.sockets.adapter.rooms[roomName];
        console.log("PAPPAPAPAAPAPAPAAPA")
        console.log(room)
        console.log(room.sockets)
        console.log(room.length);
        console.log("PAPPAPAPAAPAPAPAAPA") 
        console.log(socket.rooms)
        console.log("MAMAMAMAMAMAAMAMAMAMA") 
        console.log(rooms)
        console.log("YALAAAAAAAAA")      

        socket.emit("updaterooms", rooms, socket.rooms);

    });
   
     

var questions;
var i;

    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client) {
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
                    // console.log(questions)
                    // console.log("YAQUOI")
                    i = 0
                    console.log("------")
                    console.log(i)
                    console.log("------")

                }
            });
        }
    });

    socket.on("start", function (room) {
        console.log("bbbbbbbbbbbbbbb")
        console.log(socket.adapter.rooms)
        console.log("RECU EMIT START GAME")
        console.log("room", room)
        console.log(webSocketServer.nsps['/'].adapter.rooms)
        console.log("bbbbbbbbbbbbbbb")
        socket.join(room)
        console.log(socket.rooms)

        var testInterval = setInterval(() => {
            var question = questions[i]
            var response = Object.assign({}, questions[i]);
            // delete question.solution // LE PROBLEMEEEEEEEE
            // delete question.anecdote


            console.log(i)
            // console.log(questions[i])
            if (i >= 25) {
                clearInterval(testInterval)
                clearTimeout(testTimeout)
                return
            }
            console.log("----LALA----")
            console.log(room)
            console.log("emit question", room, question)
            console.log("----LALA----")
            webSocketServer.sockets.to(room).emit('questions', question)
            
            var testTimeout = setTimeout(() => {
                console.log("------------ICI------------")
                console.log("emit response", room, response)
                console.log("------------ICI------------")
                webSocketServer.sockets.to(room).emit('response', response) 
            }, 3000)
            i++
            console.log("-----TAPUTINDETAMERE-------")
            console.log(i) 
            console.log("-----TAPUTINDETAMERE-------")
        }, 6000);

console.log("YAQUOI")
});



    socket.on("reponseDonneeDeA", function(envoiReponseA){
        console.log("-----")
        console.log(socket.id)
        console.log("---''''---");
        console.log(envoiReponseA.reponseDeA);  
        console.log(envoiReponseA.questionDeA); 
        console.log(envoiReponseA.userId); // n'affiche rien
        console.log("---''''---")
        console.log(i)
        console.log(questions[i-1].solution);   
        console.log(questions[i-1].id); 
        console.log("--zeubi--")  
        let bonneSolutionA = questions[i-1].solution;
        if(bonneSolutionA == envoiReponseA.reponseDeA){
            console.log("score +1")
            MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client){
                if(err){
                    console.log("erreur avec mongo") 
                }else{
                    let db = client.db("jeu_mj");
                    let collection = db.collection("scores");
                    collection.find().toArray(function(err,data){
                        if(err){
                            console.log("data non trouvée")
                        }else{
                            collection.updateOne({},{$inc:{score:1}}) 
                        }
                    })
 
                }
            })
        }
    }) 
     
    socket.on("reponseDonneeDeB", function(envoiReponseB){
        console.log("---''''---");
        console.log(envoiReponseB.reponseDeB);  
        console.log(envoiReponseB.questionDeB);
        console.log("---''''---");
        console.log(i)
        console.log(questions[i-1].solution);   
        console.log(questions[i-1].id);
        console.log("--zeubi--") 
        let bonneSolutionB = questions[i-1].solution;
        if(bonneSolutionB == envoiReponseB.reponseDeB){
            console.log("score + 1!")
            MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client){
                if(err){
                    console.log("erreur avec mongo") 
                }else{
                    let db = client.db("jeu_mj");
                    let collection = db.collection("scores");
                    collection.updateOne({},{$inc:{score:1}}) 

                }
            })
        }
    }) 

    socket.on("reponseDonneeDeC", function(envoiReponseC){
        console.log("---''''---");
        console.log(envoiReponseC.reponseDeC);  
        console.log(envoiReponseC.questionDeC);
        console.log("---''''---");
        console.log(i)
        console.log(questions[i-1].solution);   
        console.log(questions[i-1].id);
        console.log("--zeubi--") 
        let bonneSolutionC = questions[i-1].solution;
        if(bonneSolutionC == envoiReponseC.reponseDeC){
            console.log("score + 1 !!")
            MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client){
                if(err){
                    console.log("erreur avec mongo") 
                }else{
                    let db = client.db("jeu_mj");
                    let collection = db.collection("scores");
                    collection.updateOne({},{$inc:{score:1}}) 

                }
            })
        }
    }) 

    socket.on("reponseDonneeDeD", function(envoiReponseD){
        console.log("---''''---");
        console.log(envoiReponseD.reponseDeD);  
        console.log(envoiReponseD.questionDeD);
        console.log("---''''---");
        console.log(i)
        console.log(questions[i-1].solution);   
        console.log(questions[i-1].id);
        console.log("--zeubi--")
        let bonneSolutionD = questions[i-1].solution;
        if(bonneSolutionD == envoiReponseD.reponseDeD){
            console.log("score + 1!!!")
            MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, client){
                if(err){
                    console.log("erreur avec mongo") 
                }else{
                    let db = client.db("jeu_mj");
                    let collection = db.collection("scores");
                    collection.updateOne({},{$inc:{score:1}}) 
                }
            })
        }  
        
    }) 



    // /**** partie pour quitter la room *****/ 
    socket.on("disconnect", function () {
        socket.leave(socket.room);  
    })
 

});


