"use strict"



var theme = window.document.getElementById("theme");
var question = window.document.getElementById("question");
var reponseA = window.document.getElementById("reponseA");
var reponseB = window.document.getElementById("reponseB");
var reponseC = window.document.getElementById("reponseC");
var reponseD = window.document.getElementById("reponseD");
var anecdote = window.document.getElementById("anecdote");
var formRoom = window.document.getElementById("createRoom")
var startGame = window.document.getElementById("startGame")


window.addEventListener("DOMContentLoaded", function(){
    var ioClient = io("http://localhost:8080");
    
    
    ioClient.on("connect", function(){
        console.log("Connecté au serveur");
    })

    ioClient.on("updaterooms", function(rooms){
        // console.log(rooms);
    })

    

    formRoom.addEventListener("submit", (event)=>{
        event.preventDefault()
        var formData = {room: formRoom.elements[0].value}
        console.log(event, formData)
        ioClient.emit('create', {room: formData})
    })

    startGame.addEventListener("submit", (event)=>{
        event.preventDefault()
        ioClient.emit('start')
    })

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


