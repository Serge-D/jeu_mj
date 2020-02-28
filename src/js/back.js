"use strict"



var theme = window.document.getElementById("theme");
var question = window.document.getElementById("question");
var reponseA = window.document.getElementById("reponseA");
var reponseB = window.document.getElementById("reponseB");
var reponseC = window.document.getElementById("reponseC");
var reponseD = window.document.getElementById("reponseD");
var reponseFinale = window.document.getElementById("reponseFinale")
var anecdote = window.document.getElementById("anecdote");
// var formRoom = window.document.getElementById("createRoom");
var startGame = window.document.getElementById("startGame");
var fenetreDeJeu = window.document.getElementById("fenetreDeJeu");
var buttonConnexion = document.getElementById("connexion");
var buttonInscription = document.getElementById("inscription");
var formInscription = document.getElementById("formInscription");
var formConnexion = document.getElementById("formConnexion");
var bouttonStart = document.getElementById("bouttonStart");

// formConnexion.style.display ="none";
// formInscription.style.display ="none";

console.log(bouttonStart)


window.addEventListener("DOMContentLoaded", function(){
// buttonConnexion.addEventListener("click", function(){
//     buttonConnexion.style.display = "none";
//     buttonInscription.style.display = "none";
//     formConnexion.style.display = "flex";
// })


// buttonInscription.addEventListener("click", function(){
//     buttonConnexion.style.display = "none";
//     buttonInscription.style.display = "none";
//     formInscription.style.display = "flex";
// })  



    
var ioClient = io("http://localhost:8080");


ioClient.on("connect", function(){
    console.log("Connecté au serveur");
})

ioClient.on("updaterooms", function(rooms){
    // console.log(rooms);
})
console.log(bouttonStart)
bouttonStart.addEventListener("click", function(event){
    console.log("ahahaahahah")
    event.preventDefault();
    ioClient.emit("start");
})
    

// formRoom.addEventListener("submit", (event)=>{
//     event.preventDefault()
//     var formData = {room: formRoom.elements[0].value}
//     console.log(event, formData)
//     ioClient.emit('create', {room: formData})
// })

startGame.addEventListener("submit", (event)=>{
    event.preventDefault();
    ioClient.emit('start')
    console.log(questionPosée)
});

var questionPosée = function(questions){
    theme.text(questions.theme);
    question.text(questions.question);
    reponseA.text(questions.propositions[0]);
    reponseB.text(questions.propositions[1]);
    reponseC.text(questions.propositions[2]);
    reponseD.text(questions.propositions[3]);
    reponseFinale.text(questions.réponse);
    anecdote.text(questions.anecdote);          
}

console.log(questionPosée)

ioClient.on("questions", function(questions){
    console.log(questions)
    
})










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




})
