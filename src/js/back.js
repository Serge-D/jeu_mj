"use strict"

var theme = window.document.getElementById("theme");
var question = window.document.getElementById("question");
var reponseA = window.document.getElementById("reponseA");
var reponseB = window.document.getElementById("reponseB");
var reponseC = window.document.getElementById("reponseC");
var reponseD = window.document.getElementById("reponseD");
var anecdote = window.document.getElementById("anecdote");

window.addEventListener("DOMContentLoaded", function(){
    var ioClient = io("http://localhost:8080");

    function sendData() {
        var XHR = new XMLHttpRequest();
    
        // Liez l'objet FormData et l'élément form
        console.log(form)
        var FD = new FormData(form);
        console.log(FD)
    }

    var formRoom = document.getElementById("createRoom")
    
    
    ioClient.on("connect", function(){
        console.log("Connecté au serveur");
    })

    ioClient.on("updaterooms", function(rooms){
        console.log(rooms);
    })

    formRoom.addEventListener("submit", (event)=>{
        var formData = new FormData(event.target)
        sendData()
        formData = {room: formRoom.elements[0].value}
        console.log(event, formData)
        ioClient.emit('create_room', {room: formData})
    })
    
    // function switchRoom(room){
    //     socket.emit("switchRoom", room)
    // }

    // ioClient.emit('create', "room1");
    // console.log("room1")

    /******** methode pour changer les questions *******/

    ioClient.on("questions", function(event){
        setTimeout(() => {
            var questionsData = JSON.parse(event.data);
            console.log(questionsData);
            
            
            
            ioClient.send()
        }, 30000);
    });




})


