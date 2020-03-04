"use strict"


console.log("prout")

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
var boutonStart = document.getElementById("boutonStart");


console.log(bouttonStart)
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
    // console.log(rooms);
})
console.log(bouttonStart)

if(bouttonStart){
bouttonStart.addEventListener("click", function(event){
    console.log("ahahaahahah")
    event.preventDefault();
    ioClient.emit("start", getCookie("room"));
})
}    


if(boutonStart){

    boutonStart.addEventListener("click", (event)=>{
                // event.preventDefault();

        console.log("room azeaeazeaea")
        var roomName = document.getElementById("roomName").value
    
        console.log(roomName)
    
        setCookie("room", roomName)
    
        ioClient.emit('create_room', roomName)
        
        console.log(questionPosée)
    });
}

var questionPosée = function(questions){

    console.log(theme);
    theme.innerHTML= questions.theme;
    question.innerHTML= questions.question;
    reponseA.innerHTML= questions.propositions[0];
    reponseB.innerHTML= questions.propositions[1];
    reponseC.innerHTML= questions.propositions[2];
    reponseD.innerHTML= questions.propositions[3];         
}

var reponsePosée = function(questions){
    
    reponseFinale.innerHTML = questions.reponse;
    anecdote.innerHTML = questions.anecdote;
}

console.log(questionPosée)

ioClient.on("questions", function(question){
    console.log(question)
    questionPosée(question)
  
})

ioClient.on("response", function(response){
    console.log(response)
    reponsePosée(response);
})


reponseA.addEventListener("click", function(){
    
})


reponseB.addEventListener("click", function(){

})


reponseC.addEventListener("click", function(){

})


reponseD.addEventListener("click", function(){
    
})











})
