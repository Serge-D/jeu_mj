"use strict"



console.log("prout")

var numQuestion = window.document.getElementById("numQuestion")
var theme = window.document.getElementById("theme");
var question = window.document.getElementById("question");
var reponseA = window.document.getElementById("reponseA");
var reponseB = window.document.getElementById("reponseB");
var reponseC = window.document.getElementById("reponseC");
var reponseD = window.document.getElementById("reponseD");
var reponseFinale = window.document.getElementById("reponseFinale")
var anecdote = window.document.getElementById("anecdote");
var startGame = window.document.getElementById("startGame");
var fenetreDeJeu = window.document.getElementById("fenetreDeJeu");
var buttonConnexion = document.getElementById("connexion");
var buttonInscription = document.getElementById("inscription");
var formInscription = document.getElementById("formInscription");
var formConnexion = document.getElementById("formConnexion");
var bouttonStart = document.getElementById("bouttonStart");
var boutonRejoindre = document.getElementById("boutonRejoindre");
var partieUne = document.getElementById("partieUne");
var partieDeux = document.getElementById("partieDeux");
var partieTrois = document.getElementById("partieTrois");
var partieQuatre = document.getElementById("partieQuatre");
var partieCinq = document.getElementById("partieCinq");
 


// console.log(bouttonStart)
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


window.addEventListener("DOMContentLoaded", function(){



    
var ioClient = io("http://localhost:8080");


ioClient.on("connect", function(){
    console.log("Connecté au serveur");
})

ioClient.on("updaterooms", function(rooms){
    console.log("je veux savoir si ca marche")
    console.log(rooms);
    

})
// console.log(bouttonStart)

if(bouttonStart){
bouttonStart.addEventListener("click", function(event){
    console.log("ahahaahahah")
    event.preventDefault();
    ioClient.emit("start", getCookie("room"));
})
}    
 

if(boutonRejoindre){

    boutonRejoindre.addEventListener("click", (event)=>{
                // event.preventDefault();

        console.log("room azeaeazeaea")
        let roomName = document.getElementById("roomName").value 
    
        console.log(roomName)
    
        setCookie("room", roomName)
    
        ioClient.emit('create_room', roomName)
        
        // console.log(questionPosée)
    });
}   

if(partieUne){

    partieUne.addEventListener("click", (event)=>{
        console.log("room Partie une");
        
        let roomName = document.getElementById("partieUne").value
        
        console.log(roomName);

        setCookie("room", roomName)

        ioClient.emit("create_room1", roomName);

        // console.log(questionPosée)
    })
}

if(partieDeux){

    partieDeux.addEventListener("click", (event)=>{
        console.log("room Partie Deux");
        let roomName = document.getElementById("partieDeux").value
        console.log(roomName);
        setCookie("room", roomName)

        ioClient.emit("create_room2", roomName);
        // console.log(questionPosée)
    })
}


if(partieTrois){

    partieTrois.addEventListener("click", (event)=>{
        console.log("room Partie Trois");
        let roomName = document.getElementById("partieTrois").value
        console.log(roomName);
        setCookie("room", roomName)

        ioClient.emit("create_room3", roomName);
        // console.log(questionPosée)
    })
}

if(partieQuatre){

    partieQuatre.addEventListener("click", (event)=>{
        console.log("room Partie Quatre");
        let roomName = document.getElementById("partieQuatre").value
        console.log(roomName);
        setCookie("room", roomName)

        ioClient.emit("create_room4", roomName);
        // console.log(questionPosée)
    })
}

if(partieCinq){

    partieCinq.addEventListener("click", (event)=>{
        console.log("room Partie Cinq");
        let roomName = document.getElementById("partieCinq").value
        console.log(roomName);
        setCookie("room", roomName)

        ioClient.emit("create_room5", roomName);
        // console.log(questionPosée)
    })
}


var questionPosée = function(questions){

    theme.innerHTML= questions.theme;
    numQuestion.innerHTML=questions.id
    question.innerHTML= questions.question;
    reponseA.innerHTML= questions.propositions[0];
    reponseB.innerHTML= questions.propositions[1];
    reponseC.innerHTML= questions.propositions[2];
    reponseD.innerHTML= questions.propositions[3];         
}

var reponsePosée = function(questions){
    
    reponseFinale.innerHTML = questions.solution;
    anecdote.innerHTML = questions.anecdote;
}

// console.log(questionPosée)

ioClient.on("questions", function(question){
    // console.log(question)
    questionPosée(question)
    reponseA.style.backgroundColor = "unset";
    reponseB.style.backgroundColor = "unset";
    reponseC.style.backgroundColor = "unset";
    reponseD.style.backgroundColor = "unset";
    reponseA.disabled = false;
    reponseB.disabled = false;
    reponseC.disabled = false;
    reponseD.disabled = false;
    reponseFinale.innerHTML = "";
    anecdote.innerHTML = "";
})

ioClient.on("response", function(response){
    // console.log(response)
    reponsePosée(response);
    reponseA.disabled = true;
    reponseB.disabled = true;
    reponseC.disabled = true;
    reponseD.disabled = true;
})

bouttonStart.addEventListener("click",function(){
    bouttonStart.disabled = true;
})

reponseA.addEventListener("click", function(){
    console.log(reponseA.innerHTML)
    console.log(numQuestion.innerHTML) // numéro de la question pour comparer la réponse en base de données
    console.log(ioClient.id)
    console.log(getCookie("user_id"))
    console.log(setCookie("room")) 

    reponseA.style.backgroundColor = "goldenrod"; 
    if(reponseA.style.backgroundColor == "goldenrod"){
        reponseA.disabled = true;
        reponseB.disabled = true;
        reponseC.disabled = true;
        reponseD.disabled = true;
    }
    let envoiReponseA = {
    reponseDeA : reponseA.innerHTML,
    questionDeA : numQuestion.innerHTML,
    userId : getCookie("user_id") 
    }
    ioClient.emit("reponseDonneeDeA", envoiReponseA );  
})


reponseB.addEventListener("click", function(){
    console.log(reponseB.innerHTML)
    console.log(numQuestion.innerHTML) // numéro de la question pour comparer la réponse en base de données
    console.log(ioClient.id)
    console.log(getCookie("user_id"))

    reponseB.style.backgroundColor = "goldenrod"; 
    if(reponseB.style.backgroundColor == "goldenrod"){
        reponseA.disabled = true;
        reponseB.disabled = true;
        reponseC.disabled = true;
        reponseD.disabled = true;
    }
    let envoiReponseB = {
        reponseDeB : reponseB.innerHTML,
        questionDeB : numQuestion.innerHTML,
        userId : getCookie("user_id") 
        }
    ioClient.emit("reponseDonneeDeB", envoiReponseB);
})


reponseC.addEventListener("click", function(){
    console.log(reponseC.innerHTML)
    console.log(numQuestion.innerHTML) // numéro de la question pour comparer la réponse en base de données
    console.log(ioClient.id)
    console.log(getCookie("user_id"))

    reponseC.style.backgroundColor = "goldenrod"; 
    if(reponseC.style.backgroundColor == "goldenrod"){
        reponseB.disabled = true;
        reponseA.disabled = true;
        reponseC.disabled = true;
        reponseD.disabled = true;
    }
    let envoiReponseC = {
        reponseDeC : reponseC.innerHTML,
        questionDeC : numQuestion.innerHTML,
        userId : getCookie("user_id") 
        };
    ioClient.emit("reponseDonneeDeC", envoiReponseC);
})


reponseD.addEventListener("click", function(){
    console.log(reponseD.innerHTML)
    console.log(numQuestion.innerHTML) // numéro de la question pour comparer la réponse en base de données
    console.log(ioClient.id)
    console.log(getCookie("user_id"))

    reponseD.style.backgroundColor = "goldenrod"; 
    if(reponseD.style.backgroundColor == "goldenrod"){
        reponseB.disabled = true;
        reponseC.disabled = true;
        reponseA.disabled = true;
        reponseD.disabled = true;
    }
    let envoiReponseD = {
        reponseDeD : reponseD.innerHTML,
        questionDeD : numQuestion.innerHTML,
        userId : getCookie("user_id") 
        }
    ioClient.emit("reponseDonneeDeD", envoiReponseD);
})



})
