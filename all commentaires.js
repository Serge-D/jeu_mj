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


/** back */

// formRoom.addEventListener("submit", (event)=>{
//     event.preventDefault()
//     var formData = {room: formRoom.elements[0].value}
//     console.log(event, formData)
//     ioClient.emit('create', {room: formData})
// })


// startGame.addEventListener("submit", (event)=>{
//     event.preventDefault();
//     ioClient.emit('create_room', 'azeazeae')
    
//     console.log(questionPosée)
// });

// function switchRoom(room){
//     socket.emit("switchRoom", room)
// }

// ioClient.emit('create', "room1");
// console.log("room1")

/******** methode pour changer les questions *******/

// ioClient.on("questions", function(event){
//     setTimeout(() => {
//         var questionsData = JSON.parse(event.data);
//         console.log(questionsData);
        
        
        
//         ioClient.send()
//     }, 30000);
// });

// socket.on("join_room", (room) => {

//     socket.join(room)
// })
// console.log(socket.adapter.rooms) // permet de voir toutes les rooms présentes


//fonction pour generer des chiffres aléatoires pour generer des numéros de questions aléatoire entre 0 et 49

// var nombreAleatoire = function (min, max) {
//     min = Math.ceil(0);   
//     max = Math.floor(49);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// var numQuestion = nombreAleatoire();