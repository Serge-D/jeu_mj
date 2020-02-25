app.post("/inscription", function(req, res){
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true },function(err, client){
        
        // test si le joueur à saisie mdp et identifiant    
        if (req.body.identifiant === "" || req.body.mdp === "") {
            res.render("home", { message: "Veuillez saisir les informations" });
        };


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
            res.render("avatar", { mess: "Bienvenue " + ident });
        });
    })
});

app.post("/connexion", function(req, res){
    MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
        if(err){
            console.log("erreur")
        }

        collection.find({pseudo: ident}).toArray(function(err, data){
            if(data.length){

                let user = data[0]; // probleme si plusieurs personnes sont connectées le data[0] n'est plus bon ????? //semi réponse = si c'est ok si la session est ouverte

                    if(user.mdp === motDePasse && user.pseudo === ident){
                        req.session.userName = user.pseudo;
                        req.session.authentification = true;
                        res.render("avatar", {message : "Bienvenue " + req.session.userName})
                    }else{
                        res.render("home", {message:"Identifiants incorrects" })
                    }
            }
        })
    })
})