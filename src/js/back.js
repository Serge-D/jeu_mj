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
// var formRoom = window.document.getElementById("createRoom");
var startGame = window.document.getElementById("startGame");
var fenetreDeJeu = window.document.getElementById("fenetreDeJeu");
var buttonConnexion = document.getElementById("connexion");
var buttonInscription = document.getElementById("inscription");
var formInscription = document.getElementById("formInscription");
var formConnexion = document.getElementById("formConnexion");
var bouttonStart = document.getElementById("bouttonStart");
var boutonStart = document.getElementById("boutonStart");

// formConnexion.style.display ="none";
// formInscription.style.display ="none";

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
